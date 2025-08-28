import { useEffect, useState } from 'react'
import useCalenderStore from '../store/useCalenderStore'
import toast from 'react-hot-toast'
import {
  CalendarContainer, CalendarMainContent, CalendarSection, TaskSection,
  CalendarHeader, CalendarNav,
  Weekdays, DaysGrid, DayCell,
  WeekView, WeekDayColumn,
  TaskSectionHeader, TaskList, TaskItem, TaskCheckbox, TaskContent,
  TaskText, TaskTime, TaskDate, TaskActions, TaskActionButton,
  EmptyTaskMessage,
  EventPopup, EventButton, TimeInputs, CloseButton
} from '../styles/CalenderStyle'

const BASE_URL = import.meta.env.VITE_API_URL

const Calender = ({ token }) => {
  const daysOfWeek = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"]
  const monthsOfYear = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"]
  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [showEventPopup, setShowEventPopup] = useState(false)
  const [eventTime, setEventTime] = useState({ hours: "00", minutes: "00" })
  const [eventText, setEventText] = useState("")
  const [editingEvent, setEditingEvent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [view, setView] = useState("month")

  const { events, addEvent, updateEvent, deleteEvent } = useCalenderStore()

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) return
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${BASE_URL}/events`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        })
        if (!res.ok) throw new Error("Kunde inte hämta events")
        const data = await res.json()
        data.forEach((ev) => addEvent(ev))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [token, addEvent])

  const saveEvent = async (event, isEdit = false) => {
    try {
      const url = isEdit ? `${BASE_URL}/events/${event.id}` : `${BASE_URL}/events`
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(event),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${res.status}`)
      }

      const saved = await res.json()
      if (isEdit) {
        updateEvent(saved)
      } else {
        addEvent(saved)
      }
    } catch (err) {
      console.error(err)
      alert(`Fel vid sparande: ${err.message}`)
    }
  }

  const removeEvent = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
      if (!res.ok) throw new Error("Kunde inte ta bort event")
      await res.json()
      deleteEvent(id)
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const toggleTodo = async (event) => {
    const updated = { ...event, done: !event.done }
    try {
      const res = await fetch(`${BASE_URL}/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated),
      })
      if (!res.ok) throw new Error("Kunde inte uppdatera todo")
      const saved = await res.json()
      updateEvent(saved)
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  // Hjälpfunktion för att få veckodagsnamn på svenska
  const getWeekdayName = (date) => {
    const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
    return weekdays[date.getDay()]
  }

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay() - 1

  const startOfWeek = (date) => {
    const d = new Date(date)
    const day = d.getDay() || 7
    const diff = d.getDate() - day + 1
    return new Date(d.setDate(diff))
  }

  const currentWeekStart = startOfWeek(new Date())
  const daysOfWeekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentWeekStart)
    d.setDate(currentWeekStart.getDate() + i)
    return d
  })

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1))
    setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear))
  }

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1))
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear))
  }

  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()

  const handleDateClick = (dayOrDate) => {
    const clickedDate =
      typeof dayOrDate === "number"
        ? new Date(currentYear, currentMonth, dayOrDate)
        : dayOrDate

    const today = new Date()
    if (clickedDate >= today || isSameDay(clickedDate, today)) {
      setSelectedDate(clickedDate)
      setShowEventPopup(true)
      setEventTime({ hours: "00", minutes: "00" })
      setEventText("")
      setEditingEvent(null)
    }
  }

  const handleEventSubmit = async () => {
    const newEvent = {
      id: editingEvent ? editingEvent.id : undefined,
      date: selectedDate.toISOString(),
      time: `${eventTime.hours.padStart(2, "0")}:${eventTime.minutes.padStart(2, "0")}`,
      text: eventText,
      done: editingEvent ? editingEvent.done : false
    }

    try {
      await saveEvent(newEvent, !!editingEvent)
      setEventTime({ hours: "00", minutes: "00" })
      setEventText("")
      setShowEventPopup(false)
      setEditingEvent(null)
    } catch (err) {
      console.error('Error submitting event:', err)
      toast.info("Fel vid sparande av händelse")
    }
  }

  const handleEditEvent = (event) => {
    setSelectedDate(new Date(event.date))
    setEventTime({
      hours: event.time.split(":")[0],
      minutes: event.time.split(":")[1]
    })
    setEventText(event.text)
    setEditingEvent(event)
    setShowEventPopup(true)
  }

  const handleTimeChange = (e) => {
    const { name, value } = e.target
    setEventTime((prev) => ({ ...prev, [name]: value.padStart(2, "0") }))
  }

  // Sortera och filtrera uppgifter för att-göra-sektionen
  const getAllTasks = () => {
    return events
      .sort((a, b) => {
        // Sortera först på datum, sedan på tid
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB
        }
        return a.time.localeCompare(b.time)
      })
  }

  const formatTaskDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (isSameDay(date, today)) {
      return "Idag"
    } else if (isSameDay(date, tomorrow)) {
      return "Imorgon"
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}`
    }
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <h2>Kalender</h2>
        <div>
          <span>{monthsOfYear[currentMonth]} {currentYear}</span>
          <CalendarNav>
            <button onClick={prevMonth}>←</button>
            <button onClick={nextMonth}>→</button>
            <button onClick={() => setView("month")}>Månad</button>
            <button onClick={() => setView("week")}>Vecka</button>
          </CalendarNav>
        </div>
      </CalendarHeader>

      {loading && <p>Laddar...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <CalendarMainContent>
        <CalendarSection>
          {view === "month" && (
            <>
              <Weekdays>
                {daysOfWeek.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </Weekdays>
              <DaysGrid>
                {[...Array(firstDayOfMonth).keys()].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth).keys()].map((day) => (
                  <DayCell
                    key={day + 1}
                    $isToday={
                      day + 1 === currentDate.getDate() &&
                      currentMonth === currentDate.getMonth() &&
                      currentYear === currentDate.getFullYear()
                    }
                    onClick={() => handleDateClick(day + 1)}
                  >
                    {day + 1}
                  </DayCell>
                ))}
              </DaysGrid>
            </>
          )}

          {view === "week" && (
            <WeekView>
              {daysOfWeekDates.map((date, idx) => (
                <WeekDayColumn
                  key={date.toISOString()}
                  $isToday={
                    date.getDate() === currentDate.getDate() &&
                    date.getMonth() === currentDate.getMonth() &&
                    date.getFullYear() === currentDate.getFullYear()
                  }
                  onClick={() => handleDateClick(date)}
                >
                  <h4>{/*{getWeekdayName(date)}*/} {date.getDate()}{/*{date.getMonth() + 1}*/}</h4>
                  <div style={{
                    fontSize: '1.2rem',
                    color: 'inherit',
                    textAlign: 'center',
                    marginTop: '5px'
                  }}>
                    {/*} {events.filter((e) => isSameDay(new Date(e.date), date)).length} uppgifter*/}
                  </div>
                </WeekDayColumn>
              ))}
            </WeekView>
          )}
        </CalendarSection>

        <TaskSection>
          <TaskSectionHeader>Att göra</TaskSectionHeader>
          <TaskList>
            {getAllTasks().length > 0 ? (
              getAllTasks().map((task, index) => (
                <TaskItem key={task.id || `task-${index}`} $completed={task.done}>
                  <TaskCheckbox
                    type="checkbox"
                    checked={task.done || false}
                    onChange={() => toggleTodo(task)}
                  />
                  <TaskContent>
                    <TaskText $completed={task.done}>{task.text}</TaskText>
                    <TaskTime>{task.time}</TaskTime>
                    <TaskDate>{formatTaskDate(task.date)}</TaskDate>
                  </TaskContent>
                  <TaskActions>
                    <TaskActionButton
                      className="edit"
                      onClick={() => handleEditEvent(task)}
                      title="Redigera"
                    >
                      ✏️
                    </TaskActionButton>
                    <TaskActionButton
                      className="delete"
                      onClick={() => removeEvent(task.id)}
                      title="Ta bort"
                    >
                      🗑
                    </TaskActionButton>
                  </TaskActions>
                </TaskItem>
              ))
            ) : (
              <EmptyTaskMessage>Inga uppgifter än</EmptyTaskMessage>
            )}
          </TaskList>
        </TaskSection>
      </CalendarMainContent>

      {showEventPopup && (
        <EventPopup>
          <CloseButton onClick={() => setShowEventPopup(false)}>✖</CloseButton>
          <h3>{editingEvent ? "Redigera händelse" : "Ny händelse"}</h3>
          <TimeInputs>
            <input type="number" name="hours" min={0} max={24} value={eventTime.hours} onChange={handleTimeChange} />
            <span>:</span>
            <input type="number" name="minutes" min={0} max={59} value={eventTime.minutes} onChange={handleTimeChange} />
          </TimeInputs>
          <textarea
            placeholder="Skriv uppgifter här (max 60 tecken)"
            value={eventText}
            onChange={(e) => e.target.value.length <= 60 ? setEventText(e.target.value) : null}
          />
          <EventButton onClick={handleEventSubmit}>
            {editingEvent ? "Uppdatera" : "Lägg till"}
          </EventButton>
        </EventPopup>
      )}
    </CalendarContainer>
  )
}

export default Calender