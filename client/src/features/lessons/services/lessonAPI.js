import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Fetches all lessons that have been published from Firestore.
 * @returns {Promise<Array>} A promise that resolves to an array of published lesson documents.
 */
export const getPublishedLessons = async () => {
  try {
    const lessonsCollection = collection(db, 'lessons');
    const q = query(lessonsCollection, where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);

    const lessons = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return lessons;
  } catch (error) {
    console.error('Error fetching published lessons:', error);
    throw error;
  }
};

