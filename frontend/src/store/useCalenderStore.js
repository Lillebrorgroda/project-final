import { create } from "zustand"

const useCalenderStore = create((set) => ({

  events: [],

  addEvent: (newEvent) =>

    set((state) => ({
      events: [...state.events, newEvent].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    })),


  updateEvent: (updatedEvent) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === updatedEvent.id ? updatedEvent : e),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),

  toggleDone: (id) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, done: !e.done } : e),
    })),

}))

export default useCalenderStore