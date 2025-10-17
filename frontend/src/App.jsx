import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchTodos() {
    try {
      const res = await fetch(`${API}/api/todos`)
      const data = await res.json()
      setTodos(data)
    } catch (e) {
      setError('Failed to load todos')
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  async function addTodo(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
      if (!res.ok) throw new Error('Failed to create')
      setTitle('')
      await fetchTodos()
    } catch (e) {
      setError('Failed to create todo')
    } finally {
      setLoading(false)
    }
  }

  async function removeTodo(id) {
    try {
      await fetch(`${API}/api/todos/${id}`, { method: 'DELETE' })
      await fetchTodos()
    } catch (e) {
      setError('Failed to delete todo')
    }
  }

  async function toggleTodo(t) {
    try {
      await fetch(`${API}/api/todos/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !t.completed })
      })
      await fetchTodos()
    } catch (e) {
      setError('Failed to update todo')
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Todos</h1>
      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="Add a todo"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button disabled={loading} type="submit">{loading ? 'Adding...' : 'Add'}</button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {todos.map(t => (
          <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <input type="checkbox" checked={t.completed} onChange={() => toggleTodo(t)} />
            <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</span>
            <button onClick={() => removeTodo(t.id)} style={{ marginLeft: 'auto' }}>Delete</button>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 24, color: '#666' }}>
        API base: <code>{API}</code>
      </p>
    </div>
  )
}