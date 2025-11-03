import { useState, useOptimistic } from 'react';

// A function to simulate a network request that might fail.
const sendComment = async (comment) => {
  if (Math.random() > 0.5) {
    throw new Error('Failed to post comment. Please try again.');
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return comment;
};

export default function CommentSection({ initialComments }) {
  const [comments, setComments] = useState([...initialComments]);
  console.log(comments, 'comments');
  const [optimisticComments, addOptimisticComment] = useOptimistic(comments);
  console.log(optimisticComments, 'optimisticComments');
  const [error, setError] = useState(null);

  const handleAddComment = async (text) => {
    // Optimistically add the new comment with a 'sending' status
    const newOptimisticComment = { text, id: Date.now(), status: 'sending' };
    addOptimisticComment((current) => [...current, newOptimisticComment]);
    console.log(optimisticComments, 'optimisticUpdate');
    setError(null); // Clear previous errors

    try {
      // Attempt the network request
      const confirmedComment = await sendComment({ text });
      // On success, update the base state with the final data
      setComments((currentComments) => [
        ...currentComments,
        { ...confirmedComment, status: 'sent' },
      ]);
    } catch (e) {
      // On failure, useOptimistic automatically reverts the UI.
      // We can then display an error message.
      setError(e.message);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {optimisticComments?.map((comment) => (
          <li key={comment.id}>
            {comment.text}
            {comment.status === 'sending' && <span style={{ color: 'white' }}> (Sending...)</span>}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const text = formData.get('comment');
          handleAddComment(text);
          e.target.reset();
        }}
      >
        <input type="text" name="comment" placeholder="Add a comment" />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
