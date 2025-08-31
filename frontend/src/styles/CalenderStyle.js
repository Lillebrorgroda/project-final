import styled from "styled-components"
import { PrimaryButton } from "../styles/components/Button.styles"


export const CalendarContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  box-shadow: 0 2px 10px ${({ theme }) => theme.colors.shadow};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`

export const CalendarMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    flex-direction: row;
    align-items: flex-start;
  }
`

export const CalendarSection = styled.div`
  flex: 1;
  min-width: 0; // Prevents flex item from overflowing
`

export const TaskSection = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing(2)};
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 350px;
    margin-left: ${({ theme }) => theme.spacing(3)};
  }
`

export const TaskSectionHeader = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.8rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  max-height: 400px;
  overflow-y: auto;
`

export const TaskItem = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border-left: 4px solid ${({ $completed, theme }) =>
    $completed ? '#28a745' : theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 4px ${({ theme }) => theme.colors.shadow};
  }
`

export const TaskCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`

export const TaskContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
`

export const TaskText = styled.span`
  font-size: 1.4rem;
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.secondary : theme.colors.text};
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
  font-family: ${({ theme }) => theme.fonts.body};
`

export const TaskTime = styled.span`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
`

export const TaskDate = styled.span`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.body};
`

export const TaskActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(0.5)};
`

export const TaskActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  padding: ${({ theme }) => theme.spacing(0.5)};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.backgroundAlt};
  }

  &.edit {
    &:hover {
      color: #ffc107;
    }
  }

  &.delete {
    &:hover {
      color: #dc3545;
    }
  }
`

export const EmptyTaskMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-style: italic;
  margin: ${({ theme }) => theme.spacing(3)} 0;
  font-family: ${({ theme }) => theme.fonts.body};
`

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  h2 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  }

  span{
    font-size: 15px;
  }
`

export const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};

  button {
    background: none;
    border: none;
    font-size: 1.6rem;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => theme.spacing(1)};
    border-radius: 6px;

    &:hover {
      background: ${({ theme }) => theme.colors.backgroundAlt};
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

export const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-top: ${({ theme }) => theme.spacing(2)};
  text-align: center;
  font-weight: bold;
   font-size: 15px;
  color: ${({ theme }) => theme.colors.text};

`

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing(0.5)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  font-size: 15px;
`

export const DayCell = styled.div`
  padding: ${({ theme }) => theme.spacing(1)};
  border-radius: 8px;
  min-height: 24px;
  max-height: 100px;
  text-align: center;
  cursor: pointer;
  background: ${({ $isToday, theme }) =>
    $isToday ? theme.colors.primary : theme.colors.backgroundAlt};
  color: ${({ $isToday, theme }) => ($isToday ? "#0C0D0D" : "inherit")};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    color: white;
  }
`

export const WeekView = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  

  
  //@media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    //grid-template-columns: 1fr;
  //}
`

export const WeekDayColumn = styled.div`
  padding: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  //background: ${({ theme }) => theme.colors.backgroundAlt};
  background: ${({ $isToday, theme }) =>
    $isToday ? theme.colors.primary : theme.colors.backgroundAlt};
  color: ${({ $isToday, theme }) => ($isToday ? "white" : "inherit")};

  h4 {
    margin: 0 0 ${({ theme }) => theme.spacing(1)};
    color: inherit;
    font-size: 1.4rem;
    font-weight: 600;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing(1)};
      margin-bottom: ${({ theme }) => theme.spacing(1)};
      font-size: 1.3rem;

      button {
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.3rem;

        &:hover {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }
`

export const EventPopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 90%;
  max-width: 400px;

  textarea {
    width: 100%;
    min-height: 80px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    padding: ${({ theme }) => theme.spacing(1)};
    font-family: ${({ theme }) => theme.fonts.body};
  }
`

export const TimeInputs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: center;

  input {
    width: 60px;
    padding: ${({ theme }) => theme.spacing(0.5)};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    font-family: ${({ theme }) => theme.fonts.body};
  }
`

export const EventButton = styled(PrimaryButton)`
  width: 100%;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  align-self: flex-end;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`