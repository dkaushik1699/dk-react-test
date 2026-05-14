import { useState } from 'react';

export function TodoForm({ onAdd }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-medium rounded-lg transition-colors duration-200"
        >
          Add
        </button>
      </div>
    </form>
  );
}
