import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  addDoc, // Import addDoc for auto-generated IDs
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Function to subscribe to node updates for a specific lesson
export const subscribeToNodeUpdates = (lessonId, setNodes) => {
  const nodesCollectionRef = collection(db, 'lessons', lessonId, 'nodes');

  return onSnapshot(nodesCollectionRef, (snapshot) => {
    const updatedNodes = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setNodes(updatedNodes);
  });
};


// Function to subscribe to edge updates for a specific lesson
export const subscribeToEdgeUpdates = (lessonId, setEdges) => {
  const edgesCollectionRef = collection(db, 'lessons', lessonId, 'edges');

  return onSnapshot(edgesCollectionRef, (snapshot) => {
    const updatedEdges = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setEdges(updatedEdges);
  });
};

// Function to add a new node to a lesson
export const addNodeToLesson = async (lessonId, nodeData) => {
  const nodesCollectionRef = collection(db, 'lessons', lessonId, 'nodes');
  try {
    const docRef = await addDoc(nodesCollectionRef, nodeData); // Use addDoc for auto-ID
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the auto-generated ID
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Function to update an existing node in a lesson
export const updateNodeInLesson = async (lessonId, nodeId, nodeData) => {
  const nodeDocRef = doc(db, 'lessons', lessonId, 'nodes', nodeId);
  try {
    await updateDoc(nodeDocRef, nodeData);
    console.log("Document updated with ID: ", nodeId);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// Function to delete a node from a lesson
export const deleteNodeFromLesson = async (lessonId, nodeId) => {
  const nodeDocRef = doc(db, 'lessons', lessonId, 'nodes', nodeId);
  try {
    await deleteDoc(nodeDocRef);
    console.log("Document deleted with ID: ", nodeId);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

// Function to add a new edge to a lesson
export const addEdgeToLesson = async (lessonId, edgeData) => {
    const edgesCollectionRef = collection(db, 'lessons', lessonId, 'edges');
    try {
      const docRef = await addDoc(edgesCollectionRef, edgeData); // Use addDoc for auto-ID
      console.log("Document written with ID: ", docRef.id);
      return docRef.id; // Return the auto-generated ID
    } catch (e) {
      console.error("Error adding edge document: ", e);
      throw e;
    }
  };

// Function to update an existing edge in a lesson
export const updateEdgeInLesson = async (lessonId, edgeId, edgeData) => {
    const edgeDocRef = doc(db, 'lessons', lessonId, 'edges', edgeId);
    try {
      await updateDoc(edgeDocRef, edgeData);
      console.log("Edge document updated with ID: ", edgeId);
    } catch (e) {
      console.error("Error updating edge document: ", e);
      throw e;
    }
  };


// Function to delete an edge from a lesson
export const deleteEdgeFromLesson = async (lessonId, edgeId) => {
  const edgeDocRef = doc(db, 'lessons', lessonId, 'edges', edgeId);
  try {
    await deleteDoc(edgeDocRef);
    console.log("Edge document deleted with ID: ", edgeId);
  } catch (e) {
    console.error("Error deleting edge document: ", e);
    throw e;
  }
};