import { useEffect, useState } from 'react'
import DatePicker from './DatePicker.jsx'
import './App.css'

const STORAGE_KEY = 'task-board:v2'

const COLUMNS = [
  { key: 'todo', label: 'Open' },
  { key: 'ongoing', label: 'On going' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
]

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : { tasks: [], nextNumber: 1 }
}

function todayStr() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
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
      tasks: [
        ...prev.tasks,
        { id: Date.now(), number: prev.nextNumber, title, status: 'todo', priority: 'low', dueDate: '' },
      ],
      nextNumber: prev.nextNumber + 1,
    }))
    setText('')
  }

  const updateTask = (id, changes) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === id ? { ...task, ...changes } : task)),
    }))
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

  const today = todayStr()

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
            data-status={column.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleColumnDrop(e, column.key)}
          >
            <h2>{column.label}</h2>
            <ul className="task-list">
              {tasks
                .filter((task) => task.status === column.key)
                .map((task) => {
                  const isOverdue = Boolean(task.dueDate) && task.dueDate < today
                  return (
                    <li
                      key={task.id}
                      className="task"
                      data-priority={task.priority}
                      data-status={task.status}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleCardDrop(e, task)}
                    >
                      <div className="task-header">
                        <span className="task-number">No.{task.number}</span>
                        <span className="task-title">{task.title}</span>
                      </div>

                      <div className="task-meta">
                        <div className="priority-toggle" role="group" aria-label="優先度">
                          <button
                            type="button"
                            className={`priority-btn high${task.priority === 'high' ? ' active' : ''}`}
                            onClick={() => updateTask(task.id, { priority: 'high' })}
                          >
                            高
                          </button>
                          <button
                            type="button"
                            className={`priority-btn low${task.priority === 'low' ? ' active' : ''}`}
                            onClick={() => updateTask(task.id, { priority: 'low' })}
                          >
                            低
                          </button>
                        </div>
                        <DatePicker
                          value={task.dueDate}
                          onChange={(dueDate) => updateTask(task.id, { dueDate })}
                          overdue={isOverdue}
                        />
                      </div>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                      >
                        削除
                      </button>
                    </li>
                  )
                })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
