import { useState } from 'react';

const Calender = () => {
  const daysOfWeek = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"]
  const monthsOfYear = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"]
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [showEventPopup, setShowEventPopup] = useState(false)


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
    const clickedDate = new Date(currentYear, currentMonth, day + 1)
    const today = new Date()
    if (clickedDate >= today) {
      setSelectedDate(clickedDate)
      setShowEventPopup(true)
    }
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
              <input type="number" name="hours" min={0} max={24} className="hours" />
              <input type="number" name="minutes" min={0} max={59} className="minutes" />
            </div>
            <textarea placeholder="Skriv uppgifter här (maximalt 60 tecken)" name="" id=""></textarea>
            <button className="event-popup-btn">Lägg till</button>
            <button className="event-popup-close" onClick={() => setShowEventPopup(false)}><i className="bx bx-x"></i></button>
          </div>)}
      </div>

      <div className="event">
        <div className="event-date-wrapper">
          <div className="event-date">1 Aug, 2024</div>
          <div className="event-time">10:00</div>
        </div>
        <div className="event-text">Vattna blommorna</div>
        <button className="event-buttons">
          <i className="bx bx-edit"></i>
          <i className="bx bx-trash"></i>
        </button>
      </div>

    </div >

  )
}

export default Calender