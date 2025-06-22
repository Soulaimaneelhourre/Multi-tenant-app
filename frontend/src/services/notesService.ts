import axios from "axios"
import type { Note } from "../types/note"

export const fetchNotes = async (token: string, domain: string): Promise<Note[]> => {
  const res = await axios.get(`http://${domain}:8000/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const deleteNote = async (id: number, token: string, domain: string): Promise<void> => {
  await axios.delete(`http://${domain}:8000/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateNote = async (note: Note, token: string, domain: string): Promise<Note> => {
  const res = await axios.put(`http://${domain}:8000/notes/${note.id}`, note, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}
export const createNote = async (
  note: { title: string; content: string },
  token: string,
  domain: string
): Promise<Note> => {
  const res = await axios.post(`http://${domain}:8000/notes`, note, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

