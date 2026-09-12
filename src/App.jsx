import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'task-board:v2'

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'ongoing', label: 'On going' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
]

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : { tasks: [], nextNumber: 1 }
}

function App() {
  const [{ tasks, nextNumber }, setState] = useState(loadState)
  const [text, setText] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, nextNumber }))
  }, [tasks, nextNumber])

  const addTask = (e) => {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setState((prev) => ({
      tasks: [...prev.tasks, { id: Date.now(), number: prev.nextNumber, title, status: 'todo' }],
      nextNumber: prev.nextNumber + 1,
    }))
    setText('')
  }

  const deleteTask = (id) => {
    setState((prev) => ({ ...prev, tasks: prev.tasks.filter((task) => task.id !== id) }))
  }

  const moveTask = (draggedId, targetStatus, beforeId) => {
    if (draggedId == null || draggedId === beforeId) return
    setState((prev) => {
      const dragged = prev.tasks.find((task) => task.id === draggedId)
      if (!dragged) return prev
      const rest = prev.tasks.filter((task) => task.id !== draggedId)
      const moved = { ...dragged, status: targetStatus }
      const index = beforeId == null ? -1 : rest.findIndex((task) => task.id === beforeId)
      const nextTasks = index === -1
        ? [...rest, moved]
        : [...rest.slice(0, index), moved, ...rest.slice(index)]
      return { ...prev, tasks: nextTasks }
    })
  }

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', String(id))
  }

  const handleCardDrop = (e, task) => {
    e.preventDefault()
    e.stopPropagation()
    const draggedId = Number(e.dataTransfer.getData('text/plain'))
    moveTask(draggedId, task.status, task.id)
  }

  const handleColumnDrop = (e, status) => {
    e.preventDefault()
    const draggedId = Number(e.dataTransfer.getData('text/plain'))
    moveTask(draggedId, status, null)
  }

  return (
    <div className="board">
      <h1>タスクボード</h1>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力"
        />
        <button type="submit">追加</button>
      </form>

      <div className="columns">
        {COLUMNS.map((column) => (
          <div
            key={column.key}
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleColumnDrop(e, column.key)}
          >
            <h2>{column.label}</h2>
            <ul className="task-list">
              {tasks
                .filter((task) => task.status === column.key)
                .map((task) => (
                  <li
                    key={task.id}
                    className="task"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleCardDrop(e, task)}
                  >
                    <span className="task-number">No.{task.number}</span>
                    <span className="task-title">{task.title}</span>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                    >
                      削除
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
