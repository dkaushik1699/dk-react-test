import { Trash2, CheckCircle2, Circle } from 'lucide-react';

export function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
        todo.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-300 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className="flex-shrink-0 text-gray-400 hover:text-slate-600 transition-colors duration-200 focus:outline-none"
        aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
      >
        {todo.completed ? (
          <CheckCircle2 size={24} className="text-green-500" />
        ) : (
          <Circle size={24} />
        )}
      </button>

      <span
        className={`flex-1 text-lg ${
          todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
        }`}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200 focus:outline-none"
        aria-label="Delete item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
