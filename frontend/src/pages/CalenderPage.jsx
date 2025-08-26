import Calender from "../components/calender.jsx"
import "../components/Calender.css"

import React from "react"

const CalenderPage = ({ token }) => {
  console.log('CalenderPage received token:', token)
  if (!token) {
    return <div>Ingen token - logga in först</div>
  }
  return (
    <div>
      <Calender token={token} />
    </div>
  )
}
export default CalenderPage