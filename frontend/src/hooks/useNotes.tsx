"use client"

import { useState, useEffect } from "react"
import { notesService } from "@/services/notesService"
import type { Note, CreateNoteData, UpdateNoteData } from "@/types/note"
import { useToast } from "@/hooks/use-toast"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const data = await notesService.getNotes()
      setNotes(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async (data: CreateNoteData) => {
    try {
      const newNote = await notesService.createNote(data)
      setNotes((prev) => [newNote, ...prev])
      toast({
        title: "Success",
        description: "Note created successfully",
      })
      return newNote
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateNote = async (id: number, data: UpdateNoteData) => {
    try {
      const updatedNote = await notesService.updateNote(id, data)
      setNotes((prev) => prev.map((note) => (note.id === id ? updatedNote : note)))
      toast({
        title: "Success",
        description: "Note updated successfully",
      })
      return updatedNote
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteNote = async (id: number) => {
    try {
      await notesService.deleteNote(id)
      setNotes((prev) => prev.filter((note) => note.id !== id))
      toast({
        title: "Success",
        description: "Note deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  }
}
