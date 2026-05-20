import { TodoItem } from './TodoItem';

export function TodoList({ todos, onToggle, onDelete }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No items yet. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
