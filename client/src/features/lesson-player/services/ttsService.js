// Toggle between TTS providers: 'browser' or 'gcp'
import { importPKCS8, SignJWT } from 'jose';
// Load GCP service account credentials from Vite env (client-side)
// IMPORTANT: Private keys in client env are visible in the built bundle. Use only for development.
const serviceAccount = {
  project_id: import.meta.env.VITE_GCP_TTS_PROJECT_ID || '',
  client_email: import.meta.env.VITE_GCP_TTS_CLIENT_EMAIL || '',
  // Convert literal \n to real newlines
  private_key: (import.meta.env.VITE_GCP_TTS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  token_uri: import.meta.env.VITE_GCP_TTS_TOKEN_URI || 'https://oauth2.googleapis.com/token',
};

// Toggle between TTS providers: 'browser' or 'gcp'
export const TTS_PROVIDER = 'gcp'; // Use Google Cloud TTS by default

// Browser TTS state
let voices = [];
let voicesReady = false;
let lastSpokenText = '';
let isSpeaking = false;

// Google Cloud TTS state
let gcpAudioContext = null;
let currentGcpSource = null;
let gcpAccessToken = null;
let gcpTokenExpiryMs = 0;

// Google Cloud TTS Configuration
const GCP_TTS_CONFIG = {
  projectId: serviceAccount.project_id,
  voice: {
    languageCode: 'en-GB',
    name: 'en-GB-Neural2-A', // British female voice (Neural2)
    ssmlGender: 'FEMALE'
  },
  audioConfig: {
    audioEncoding: 'MP3',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGainDb: 0.0
  }
};

/**
 * Populates the voices array.
 */
const loadVoices = () => {
  voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    voicesReady = true;
    console.log('TTS Voices loaded:', voices.length, voices.map(v => v.name));
  }
};

// Initialize browser TTS if available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

// Initialize Audio Context for Google Cloud TTS
const initializeAudioContext = () => {
  if (!gcpAudioContext) {
    gcpAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return gcpAudioContext;
};

/**
 * Waits until at least one English voice is available.
 */
const waitForVoices = async (timeout = 1500) => {
  const start = Date.now();
  while (!voicesReady && Date.now() - start < timeout) {
    await new Promise(r => setTimeout(r, 100));
    loadVoices();
  }
};

/**
 * Obtain and cache an OAuth2 access token using the service account (JWT bearer flow)
 */
const getGcpAccessToken = async () => {
  const now = Date.now();
  // Reuse cached token with 60s buffer
  if (gcpAccessToken && now < gcpTokenExpiryMs - 60_000) {
    return gcpAccessToken;
  }

  // Basic validation for required credentials
  if (!serviceAccount.client_email || !serviceAccount.private_key || !serviceAccount.token_uri) {
    console.error('GCP TTS credentials missing in env. Please set VITE_GCP_TTS_PROJECT_ID, VITE_GCP_TTS_CLIENT_EMAIL, VITE_GCP_TTS_PRIVATE_KEY');
    throw new Error('GCP TTS credentials missing');
  }

  const alg = 'RS256';
  const privateKey = await importPKCS8(serviceAccount.private_key, alg);
  const iat = Math.floor(now / 1000);

  const jwt = await new SignJWT({ scope: 'https://www.googleapis.com/auth/cloud-platform' })
    .setProtectedHeader({ alg, typ: 'JWT' })
    .setIssuedAt(iat)
    .setIssuer(serviceAccount.client_email)
    .setAudience(serviceAccount.token_uri)
    .setExpirationTime('1h')
    .sign(privateKey);

  const form = new URLSearchParams();
  form.set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  form.set('assertion', jwt);

  const res = await fetch(serviceAccount.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`GCP OAuth token error: ${res.status} ${msg}`);
  }

  const token = await res.json();
  gcpAccessToken = token.access_token;
  gcpTokenExpiryMs = now + (token.expires_in || 3600) * 1000;
  return gcpAccessToken;
};

/**
 * Google Cloud TTS API call to synthesize speech
 */
const synthesizeWithGCP = async (text) => {
  const accessToken = await getGcpAccessToken();

  const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-Goog-User-Project': GCP_TTS_CONFIG.projectId,
    },
    body: JSON.stringify({
      input: { text: text },
      voice: GCP_TTS_CONFIG.voice,
      audioConfig: GCP_TTS_CONFIG.audioConfig
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`GCP TTS API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.audioContent; // Base64 encoded audio
};

/**
 * Play audio using Web Audio API
 */
const playGCPAudio = async (base64Audio) => {
  const audioContext = initializeAudioContext();
  
  // Resume audio context if suspended (required by some browsers)
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // Convert base64 to array buffer
  const binaryString = atob(base64Audio);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  // Decode and play audio
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  
  currentGcpSource = source;
  
  return new Promise((resolve, reject) => {
    source.onended = () => {
      isSpeaking = false;
      currentGcpSource = null;
      resolve();
    };
    
    source.onerror = (error) => {
      isSpeaking = false;
      currentGcpSource = null;
      reject(error);
    };
    
    source.start();
  });
};

/**
 * Browser-based TTS implementation
 */
const speakWithBrowser = async (text) => {
  if (!text || typeof text !== 'string' || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Browser TTS not available or invalid text');
    return;
  }

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();
  
  await waitForVoices();

  const utterance = new SpeechSynthesisUtterance(text);
  const availableVoices = window.speechSynthesis.getVoices();

  // --- Voice Selection ---
  let selectedVoice =
    // 1. Google Female English
    availableVoices.find(v => v.name.includes('Google') && v.name.includes('Female') && v.lang.startsWith('en-')) ||
    // 2. Any Google English
    availableVoices.find(v => v.name.includes('Google') && v.lang.startsWith('en-')) ||
    // 3. Zira or Luciana
    availableVoices.find(v => v.lang.startsWith('en-') && ['Zira','Luciana'].some(n => v.name.includes(n))) ||
    // 4. Any Female English
    availableVoices.find(v => v.name.includes('Female') && v.lang.startsWith('en-')) ||
    // 5. US English
    availableVoices.find(v => v.lang === 'en-US') ||
    // 6. Any English
    availableVoices.find(v => v.lang.startsWith('en-'));

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  // Configure utterance properties
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  console.log('Browser TTS - Selected voice:', selectedVoice ? selectedVoice.name : 'Default');
  console.log('Browser TTS - Speaking:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));

  return new Promise((resolve) => {
    let hasStarted = false;
    let hasFinished = false;
    
    const cleanup = () => {
      if (!hasFinished) {
        hasFinished = true;
        isSpeaking = false;
        resolve();
      }
    };
    
    // Fallback timeout in case the utterance gets stuck
    const timeout = setTimeout(() => {
      if (!hasStarted) {
        console.warn('Browser TTS - Timeout, speech failed to start');
        window.speechSynthesis.cancel();
        cleanup();
      }
    }, 2000); // Increased timeout to 2 seconds
    
    utterance.onstart = () => {
      hasStarted = true;
      clearTimeout(timeout);
      console.log('Browser TTS - Started speaking');
    };
    
    utterance.onend = () => { 
      console.log('Browser TTS - Finished speaking');
      clearTimeout(timeout);
      cleanup();
    };
    
    utterance.onerror = (event) => { 
      console.error('Browser TTS - Error:', event.error);
      clearTimeout(timeout);
      cleanup();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Browser TTS - Exception when calling speak:', error);
      clearTimeout(timeout);
      cleanup();
    }
  });
};

/**
 * Main speak function that uses the configured TTS provider
 */
export const speak = async (text) => {
  if (!text || typeof text !== 'string') {
    return;
  }

  // Enhanced duplicate prevention for React StrictMode
  const now = Date.now();
  const recentDuplicateThreshold = 2000; // 2 seconds
  
  // Check if we're already speaking this exact text
  if (isSpeaking && text === lastSpokenText) {
    console.log('TTS prevented duplicate (already speaking):', text.substring(0, 50) + '...');
    return;
  }

  // Check if same text was spoken very recently
  if (lastSpokenText === text && (now - (window.lastTTSTime || 0)) < recentDuplicateThreshold) {
    console.log('TTS prevented recent duplicate (timing):', text.substring(0, 50) + '...');
    return;
  }

  // Only cancel if we're speaking different text
  if (isSpeaking && text !== lastSpokenText) {
    console.log('TTS cancelling previous speech for new text');
    cancelSpeech();
  }

  isSpeaking = true;
  lastSpokenText = text;
  window.lastTTSTime = now;

  try {
    console.log(`Using ${TTS_PROVIDER} TTS for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    if (TTS_PROVIDER === 'gcp') {
      const audioContent = await synthesizeWithGCP(text);
      await playGCPAudio(audioContent);
    } else {
      await speakWithBrowser(text);
    }
  } catch (error) {
    console.error('TTS Error:', error);
    isSpeaking = false;
    
    // Fallback to browser TTS if GCP fails
    if (TTS_PROVIDER === 'gcp') {
      console.log('Falling back to browser TTS...');
      try {
        await speakWithBrowser(text);
      } catch (fallbackError) {
        console.error('Fallback TTS also failed:', fallbackError);
      }
    }
  }
};

/**
 * Stops any currently ongoing speech (both browser and GCP TTS).
 */
export const cancelSpeech = () => {
  isSpeaking = false;
  
  // Cancel browser TTS
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  
  // Cancel GCP TTS
  if (currentGcpSource) {
    try {
      currentGcpSource.stop();
      currentGcpSource = null;
    } catch (error) {
      console.warn('Error stopping GCP TTS audio source:', error);
    }
  }
};

/**
 * Get current TTS provider
 */
export const getCurrentTTSProvider = () => TTS_PROVIDER;

/**
 * Check if TTS is currently speaking
 */
export const isTTSSpeaking = () => isSpeaking;

/**
 * Get available voice options for the current provider
 */
export const getAvailableVoices = () => {
  if (TTS_PROVIDER === 'gcp') {
    return [
      { name: 'en-GB-Neural2-A', description: 'British Female (Neural2-A)' },
      { name: 'en-GB-Neural2-B', description: 'British Male (Neural2-B)' },
      { name: 'en-GB-Neural2-C', description: 'British Female (Neural2-C)' },
      { name: 'en-GB-Neural2-D', description: 'British Male (Neural2-D)' },
      { name: 'en-GB-Neural2-F', description: 'British Female (Neural2-F)' }
    ];
  } else {
    return voices.map(v => ({ name: v.name, description: `${v.lang} - ${v.name}` }));
  }
};
