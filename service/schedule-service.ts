import { db } from "@/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"


export type Event = {
  id?: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  type: "class" | "personal"
  userId: string
  createdAt?: any
  updatedAt?: any
}

// Get all events for a user
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const events: Event[] = []
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event)
    })

    return events
  } catch (error) {
    console.error("Error getting user events:", error)
    throw error
  }
}

// Get events for a specific date
export const getEventsForDate = async (userId: string, date: string): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, "events")
    const q = query(eventsRef, where("userId", "==", userId), where("date", "==", date))
    const querySnapshot = await getDocs(q)

    const events: Event[] = []
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event)
    })

    return events
  } catch (error) {
    console.error("Error getting events for date:", error)
    throw error
  }
}

// Add a new event
export const addEvent = async (event: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const eventsRef = collection(db, "events")
    const docRef = await addDoc(eventsRef, {
      ...event,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding event:", error)
    throw error
  }
}

// Update an existing event
export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<void> => {
  try {
    const eventRef = doc(db, "events", id)
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

// Delete an event
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const eventRef = doc(db, "events", id)
    await deleteDoc(eventRef)
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}

