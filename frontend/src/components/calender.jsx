
import { useState } from 'react';

const Calender = () => {
  const daysOfWeek = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"]
  const monthsOfYear = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"]
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [showEventPopup, setShowEventPopup] = useState(false)
  const [event, setEvent] = useState([])
  const [eventTime, setEventTime] = useState({
    hours: "00",
    minutes: "00"
  })
  const [eventText, setEventText] = useState("")
  const [editingEvent, setEditingEvent] = useState(null)


  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay() - 1 // -1 Adjust for Monday start

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1))
    setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear))
  }

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1))
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear))
  }

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day)
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

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )

  }

  const handleEventSubmit = () => {
    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      date: selectedDate,
      time: `${eventTime.hours.padStart(2, "0")}:${eventTime.minutes.padStart(2, "0")}`,
      text: eventText
    }

    let updatedEvent = [...event]

    if (editingEvent) {
      updatedEvent = updatedEvent.map((e) => (e.id === editingEvent.id ? newEvent : e))
    } else {
      updatedEvent.push(newEvent)
    }

    updatedEvent.sort((a, b) => new Date(a.date) - new Date(b.date))

    setEvent(updatedEvent)
    setEventTime({
      hours: "00",
      minutes: "00"
    })
    setEventText("")
    setShowEventPopup(false)
    setEditingEvent(null)

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

  const handleDeleteEvent = (eventId) => {
    const updatedEvent = event.filter((event) => event.id !== eventId)
    setEvent(updatedEvent)

  }

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
        </div>
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
        ))}

      </div >
    </div >
  )
}

export default Calender