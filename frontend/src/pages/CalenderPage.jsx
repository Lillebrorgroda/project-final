import Calender from "../components/calender.jsx"
import "../components/Calender.css"

import React from "react"

const CalenderPage = ({ token }) => {
  console.log('CalenderPage received token:', token)
  return (
    <div>
      <Calender token={token} />
    </div>
  )
}
export default CalenderPage