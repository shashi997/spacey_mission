import QuizNode from './QuizNode';
import NarrationNode from './NarrationNode';

/**
 * Centralized object for all custom node types.
 * This makes it easy to register them with React Flow.
 */
export const nodeTypes = {
  quiz: QuizNode,
  narration: NarrationNode, // We'll use the 'default' type for narration for simplicity
};

