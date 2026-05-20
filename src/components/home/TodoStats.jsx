export function TodoStats({ stats, onClearCompleted }) {
  return (
    <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
      <div className="flex gap-6">
        <div>
          <span className="font-semibold text-gray-800">{stats.active}</span> active
        </div>
        <div>
          <span className="font-semibold text-gray-800">{stats.completed}</span> completed
        </div>
        <div>
          <span className="font-semibold text-gray-800">{stats.total}</span> total
        </div>
      </div>
      {stats.completed > 0 && (
        <button
          onClick={onClearCompleted}
          className="text-red-500 hover:text-red-700 transition-colors duration-200 font-medium"
        >
          Clear completed
        </button>
      )}
    </div>
  );
}
