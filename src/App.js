import React, { useState, useEffect } from 'react';
import './App.css'; // Import the external CSS file

const API_URL = 'https://backendpit3.onrender.com/';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  const fetchTodos = async () => {
    try {
      let url = API_URL;
      if (filter !== 'all') url += `/filter/${filter === 'completed'}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setTodos(await res.json());
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const addTodo = async () => {
    if (!title.trim()) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed: false }),
    });
    setTitle('');
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await fetch(`${API_URL}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  return (
    <div className={`min-h-screen px-6 py-12 transition-colors duration-500 ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="max-w-lg mx-auto">
        <div className={`card ${darkMode ? 'card-dark' : 'card-light'}`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="header">📝 To-Do List</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="button">
              {darkMode ? '☀ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Input */}
          <div className="flex items-center space-x-4 mb-6">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="input-field"
              placeholder="Add a new task..."
            />
            <button
              onClick={addTodo}
              className="button button-dark">
              ➕ Add
            </button>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-6 mb-6">
            {['all', 'completed', 'pending'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn ${filter === f ? 'filter-btn-active' : 'filter-btn-inactive'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Task List */}
          {todos.length === 0 ? (
            <p className="text-center text-lg text-gray-500">
              {filter === 'completed'
                ? 'No completed tasks yet.'
                : filter === 'pending'
                ? 'You’re all caught up!'
                : 'Start by adding a task above.'}
            </p>
          ) : (
            <ul className="space-y-5">
              {todos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo)}
                      className="accent-indigo-500 w-6 h-6"
                    />
                    <span className={`todo-text ${todo.completed ? 'todo-text-completed' : ''}`}>
                      {todo.title}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="todo-delete">
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
