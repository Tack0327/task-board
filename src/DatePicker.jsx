import { useState } from 'react'
import './DatePicker.css'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function toDateStr(year, month, day) {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

function parseDateStr(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return { year, month: month - 1, day }
}

function DatePicker({ value, onChange, overdue }) {
  const [open, setOpen] = useState(false)
  const today = new Date()
  const [viewYear, setViewYear] = useState(() => (parseDateStr(value) ?? today).year ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(() => (parseDateStr(value)?.month) ?? today.getMonth())

  const toggleOpen = () => {
    if (!open) {
      const base = parseDateStr(value) ?? { year: today.getFullYear(), month: today.getMonth() }
      setViewYear(base.year)
      setViewMonth(base.month)
    }
    setOpen((prev) => !prev)
  }

  const changeMonth = (delta) => {
    let year = viewYear
    let month = viewMonth + delta
    if (month < 0) {
      month = 11
      year -= 1
    } else if (month > 11) {
      month = 0
      year += 1
    }
    setViewYear(year)
    setViewMonth(month)
  }

  const selectDay = (day) => {
    onChange(toDateStr(viewYear, viewMonth, day))
    setOpen(false)
  }

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="date-picker">
      <button
        type="button"
        draggable={false}
        className={`date-picker-trigger${overdue ? ' overdue' : ''}`}
        onClick={toggleOpen}
      >
        {value || '期限を設定'}
      </button>

      {open && (
        <>
          <div className="date-picker-backdrop" onClick={() => setOpen(false)} />
          <div className="date-picker-calendar">
            <div className="date-picker-header">
              <button type="button" draggable={false} onClick={() => changeMonth(-1)} aria-label="前の月">
                ‹
              </button>
              <span>{viewYear}年{viewMonth + 1}月</span>
              <button type="button" draggable={false} onClick={() => changeMonth(1)} aria-label="次の月">
                ›
              </button>
            </div>
            <div className="date-picker-grid">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday} className="date-picker-weekday">
                  {weekday}
                </span>
              ))}
              {cells.map((day, index) => {
                if (day == null) return <span key={`empty-${index}`} />
                const dateStr = toDateStr(viewYear, viewMonth, day)
                return (
                  <button
                    type="button"
                    key={dateStr}
                    draggable={false}
                    className={`date-picker-day${dateStr === value ? ' selected' : ''}`}
                    onClick={() => selectDay(day)}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DatePicker
