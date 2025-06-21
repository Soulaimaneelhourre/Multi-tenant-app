import { apiClient } from "./apiClient"
import type { Note, CreateNoteData, UpdateNoteData } from "@/types/note"

export const notesService = {
  async getNotes(): Promise<Note[]> {
    const response = await apiClient.get("/notes")
    return response.data
  },

  async createNote(data: CreateNoteData): Promise<Note> {
    const response = await apiClient.post("/notes", data)
    return response.data
  },

  async updateNote(id: number, data: UpdateNoteData): Promise<Note> {
    const response = await apiClient.put(`/notes/${id}`, data)
    return response.data
  },

  async deleteNote(id: number): Promise<void> {
    await apiClient.delete(`/notes/${id}`)
  },
}
