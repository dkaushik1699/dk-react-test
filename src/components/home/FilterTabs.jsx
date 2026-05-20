export function FilterTabs({ currentFilter, onFilterChange }) {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
            currentFilter === filter.value
              ? 'border-slate-800 text-slate-900'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
