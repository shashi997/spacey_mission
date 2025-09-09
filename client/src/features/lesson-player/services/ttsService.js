let voices = [];
let voicesReady = false;
let lastSpokenText = '';
let isSpeaking = false;

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

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

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
 * Speaks the given text.
 */
export const speak = async (text) => {
  if (!text || typeof text !== 'string' || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  await waitForVoices();

  // Prevent duplicate playback (React StrictMode / double renders)
  if (isSpeaking && text === lastSpokenText) {
    console.log('TTS prevented duplicate for:', text);
    return;
  }

  cancelSpeech(); // stop anything ongoing

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
  console.log('Selected voice:', selectedVoice ? selectedVoice.name : 'Default');

  isSpeaking = true;
  lastSpokenText = text;

  utterance.onend = () => { isSpeaking = false; };
  utterance.onerror = () => { isSpeaking = false; };

  window.speechSynthesis.speak(utterance);
};

/**
 * Stops any currently ongoing speech.
 */
export const cancelSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    isSpeaking = false;
    window.speechSynthesis.cancel();
  }
};
