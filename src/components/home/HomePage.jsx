import { CheckSquare } from 'lucide-react';
import { useTodos } from '../../hooks/useTodos';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import { TodoStats } from './TodoStats';
import { FilterTabs } from './FilterTabs';

export function HomePage() {
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
    <div className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/50">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <CheckSquare size={32} className="text-sky-600" />
          <h1 className="text-4xl font-bold text-slate-900">My Todos</h1>
        </div>
        <p className="text-slate-600">Stay organized and productive with a clean home page.</p>
      </div>

      <TodoForm onAdd={addTodo} />
      <FilterTabs currentFilter={filter} onFilterChange={setFilter} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <TodoStats stats={stats} onClearCompleted={clearCompleted} />
    </div>
  );
}
