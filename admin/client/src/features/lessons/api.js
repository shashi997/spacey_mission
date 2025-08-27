import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const lessonsCollectionRef = collection(db, 'lessons');

// READ all lessons
export const getLessons = async () => {
  const snapshot = await getDocs(lessonsCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// CREATE a new lesson
export const createLesson = async (lessonData) => {
  // Per your request, we are using the lesson title to generate the document ID.
  // Note: This is generally not recommended because document IDs must be unique and
  // cannot be easily changed. A typo in a title would require deleting and
  // recreating the document. Using auto-generated IDs from Firestore is often safer.
  const { title, ...restOfData } = lessonData;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new Error("A non-empty title is required to create a lesson document.");
  }

  // Sanitize the title to create a URL-friendly and Firestore-safe document ID.
  const docId = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const docRef = doc(db, 'lessons', docId);

  await setDoc(docRef, {
    title, // Storing title inside the doc as well for easier access
    ...restOfData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docId;
};

// UPDATE a lesson
export const updateLesson = async (lessonId, lessonData) => {
  const docRef = doc(db, 'lessons', lessonId);
  await updateDoc(docRef, { ...lessonData, updatedAt: serverTimestamp() });
};

// DELETE a lesson
export const deleteLesson = async (lessonId) => {
  const docRef = doc(db, 'lessons', lessonId);
  await deleteDoc(docRef);
};

