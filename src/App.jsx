import { CheckSquare } from 'lucide-react';
import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoStats } from './components/TodoStats';
import { FilterTabs } from './components/FilterTabs';

function App() {
  const {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    filter,
    setFilter,
    stats,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckSquare size={32} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">My Todos</h1>
          </div>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Form */}
          <TodoForm onAdd={addTodo} />

          {/* Filter Tabs */}
          <FilterTabs currentFilter={filter} onFilterChange={setFilter} />

          {/* Todo List */}
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

          {/* Stats */}
          <TodoStats stats={stats} onClearCompleted={clearCompleted} />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Built with React & Tailwind CSS
        </p>
      </div>
    </div>
  );
}

export default App;
