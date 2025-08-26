
import { useEffect, useState } from 'react'
import useCalenderStore from '../store/useCalenderStore'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://garden-backend-r6x2.onrender.com"

const Calender = ({ token }) => {
  console.log('Calender received token:', token)

  const daysOfWeek = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"]
  const monthsOfYear = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"]
  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [showEventPopup, setShowEventPopup] = useState(false)
  const [eventTime, setEventTime] = useState({
    hours: "00",
    minutes: "00"
  })
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
        const res = await fetch(`${BASE_URL}/events`,
          {
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
    if (!token) { // ✅ Lägg till denna kontroll
      console.error('No token available')
      return
    }

    try {
      const url = isEdit ? `${BASE_URL}/events/${event.id}` : `${BASE_URL}/events`
      const method = isEdit ? "PUT" : "POST"
      console.log('Saving event:', { url, method, event, token: !!token })

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(event),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${res.status}`)
      }


      const saved = await res.json();
      console.log("saved event", saved)

      if (isEdit) {
        updateEvent(saved);
      } else {
        addEvent(saved);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
      console.error('Full error object:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);

      // Provide more specific error messages
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        alert('Nätverksfel: Kunde inte ansluta till servern. Kontrollera din internetanslutning och att servern är tillgänglig.');
      } else if (err.message.includes('CORS')) {
        alert('CORS-fel: Servern tillåter inte förfrågningar från denna domän.');
      } else {
        alert(`Fel vid sparande: ${err.message}`);
      }
    }

  };

  // ta bort event
  const removeEvent = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error("Kunde inte ta bort event");
      await res.json();
      deleteEvent(id);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // markera todo som klar/oklar
  const toggleTodo = async (event) => {
    const updated = { ...event, done: !event.done };
    try {
      const res = await fetch(`${BASE_URL}/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Kunde inte uppdatera todo");
      const saved = await res.json();
      updateEvent(saved);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay() - 1 // -1 Adjust for Monday start

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

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )

  }

  const handleDateClick = (dayOrDate) => {
    const clickedDate = typeof dayOrDate === "number" ? new Date(currentYear, currentMonth, dayOrDate) : dayOrDate

    const today = new Date()
    if (clickedDate >= today || isSameDay(clickedDate, today)) {
      setSelectedDate(clickedDate)
      setShowEventPopup(true)
      setEventTime({
        hours: "00",
        minutes: "00"
      })
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

    console.log('Submitting event:', newEvent)



    try {

      await saveEvent(newEvent, !!editingEvent)

      {/*if (editingEvent) {
        updateEvent(newEvent)
      } else {
        addEvent(newEvent)
}*/}

      setEventTime({
        hours: "00",
        minutes: "00"
      })
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

  {/**
  const handleDeleteEvent = (eventId) => {
    const updatedEvent = event.filter((event) => event.id !== eventId)
    setEvent(updatedEvent)

  } */}

  const handleTimeChange = (e) => {
    const { name, value } = e.target
    setEventTime((prev) => ({ ...prev, [name]: value.padStart(2, "0") }))

  }

  return (
    <div className="calender-app">
      <div className="calender">
        <h2 className="heading">Kalender</h2>
        <div className="navigate-date">
          <h3>{monthsOfYear[currentMonth]}</h3>
          <h3>{currentYear}</h3>
          <div className="buttons">
            <i className="bx bx-chevron-left" onClick={prevMonth}></i>
            <i className="bx bx-chevron-right" onClick={nextMonth}></i>
          </div>
          <button onClick={() => setView("month")}>Månad</button>
          <button onClick={() => setView("week")}>Vecka</button>
        </div>
        {loading && <p>Laddar...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {view === "month" && (
          <>

            <div className="weekdays">

              {daysOfWeek.map((day) => (
                <span className="weekday" key={day}>{day}</span>
              ))}
            </div>
            <div className="days">
              {[...Array(firstDayOfMonth).keys()].map((_, index) => <span key={`empty-${index}`} />)}
              {[...Array(daysInMonth).keys()].map((day) => (<span key={day + 1} className={
                day + 1 === currentDate.getDate() &&
                  currentMonth === currentDate.getMonth() &&
                  currentYear === currentDate.getFullYear()
                  ? "current-day"
                  : ""
              }
                onClick={() => handleDateClick(day + 1)}
              >
                {day + 1}
              </span>))}
            </div>

          </>
        )}

        {view === "week" && (
          <div className="week-view">
            {daysOfWeekDates.map((date, idx) => (
              <div
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
              >
                <h4>{daysOfWeek[idx]} {date.getDate()}/{date.getMonth() + 1}</h4>
                <ul>
                  {events.filter((e) => isSameDay(new Date(e.date), date))
                    .map((e) => (
                      <li key={e.id}>
                        <input
                          type="checkbox"
                          checked={e.done || false}
                          onChange={() => toggleTodo(e)}
                        />
                        {e.time} - {e.text}
                        <button onClick={() => handleEditEvent(e)}>✏️</button>
                        <button onClick={() => removeEvent(e.id)}>🗑</button>

                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>
      <div className="events">
        {showEventPopup && (
          <div className="event-popup">
            <div className="time-input">
              <div className="event-popup-time">Tid</div>
              <input type="number"
                name="hours"
                min={0}
                max={24}
                className="hours"
                value={eventTime.hours}
                onChange={handleTimeChange}
              />
              <input type="number"
                name="minutes"
                min={0}
                max={59}
                className="minutes"
                value={eventTime.minutes}
                onChange={handleTimeChange}
              />
            </div>
            <textarea placeholder="Skriv uppgifter här (maximalt 60 tecken)" value={eventText} onChange={(e) => {
              if (e.target.value.length <= 60) {
                setEventText(e.target.value);
              } else {
                alert("Maximalt 60 tecken tillåtna.");
              }
            }} name="" id=""></textarea>
            <button className="event-popup-btn" onClick={handleEventSubmit}>{editingEvent ? "Uppdatera" : "Lägg till"}</button>
            <button className="event-popup-close" onClick={() => setShowEventPopup(false)}><i className="bx bx-x"></i></button>
          </div>
        )}
        {/*
        {event.map((event, index) => (
          <div className="event" key={index}>
            <div className="event-date-wrapper">
              <div className="event-date">{`${monthsOfYear[event.date.getMonth()]} ${event.date.getDate()}, ${event.date.getFullYear()}`}</div>
              <div className="event-time">{event.time}</div>
            </div>
            <div className="event-text">{event.text}</div>
            <div className="event-buttons">
              <i className="bx bx-edit" onClick={() => handleEditEvent(event)}></i>
              <i className="bx bx-trash" onClick={() => handleDeleteEvent(event.id)}></i>
            </div>
          </div>
        ))} */}

      </div >
    </div >
  )
}
}

export default Calender