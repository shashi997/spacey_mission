import { create } from 'zustand';
import { getLessonDesign } from '../services/lessonPlayerAPI';
import { devtools } from 'zustand/middleware';

/**
 * A Zustand store to manage the state for the active lesson player.
 * This ensures that lesson data is fetched only once and shared across components
 * like the LessonPage and the Navbar.
 */
const lessonStore = (set, get) => ({
  lesson: null,
  loading: true,
  error: null,

  /**
   * Fetches the complete lesson design, including nodes and edges.
   * @param {string} lessonId - The ID of the lesson to fetch.
   */
  fetchLesson: async (lessonId) => {
    // Avoid re-fetching if the same lesson is already loaded or being loaded.
    if (get().lesson?.id === lessonId) {
      return;
    }

    try {
      set({ loading: true, error: null, lesson: null });
      const lessonData = await getLessonDesign(lessonId);
      set({ lesson: lessonData, loading: false, error: lessonData ? null : 'Lesson not found.' });
    } catch (err) {
      console.error('Failed to fetch lesson in store:', err);
      set({ error: 'Failed to load lesson.', loading: false });
    }
  },

  /**
   * Clears the lesson data from the store when navigating away.
   */
  clearLesson: () => {
    set({ lesson: null, loading: false, error: null });
  },
});

export const useLessonStore = create(
  devtools(lessonStore, { name: 'LessonPlayerStore' })
);
