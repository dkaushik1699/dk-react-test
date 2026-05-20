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
          placeholder="Enter an item..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-3 cursor-pointer bg-slate-800 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Add
        </button>
      </div>
    </form>
  );
}
