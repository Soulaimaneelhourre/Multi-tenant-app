"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNotes } from "@/hooks/useNotes"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { NotesList } from "@/components/notes/NotesList"
import { NoteDialog } from "@/components/notes/NoteDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Note } from "@/types/note"

export function DashboardPage() {
  const { user } = useAuth()
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const handleCreateNote = () => {
    setEditingNote(null)
    setIsDialogOpen(true)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setIsDialogOpen(true)
  }

  const handleSaveNote = async (data: { title: string; content: string }) => {
    if (editingNote) {
      await updateNote(editingNote.id, data)
    } else {
      await createNote(data)
    }
    setIsDialogOpen(false)
    setEditingNote(null)
  }

  const handleDeleteNote = async (id: number) => {
    await deleteNote(id)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Manage your notes for {user?.company.name}</p>
          </div>
          <Button onClick={handleCreateNote} className="gap-2">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>

        <NotesList notes={notes} isLoading={isLoading} onEdit={handleEditNote} onDelete={handleDeleteNote} />

        <NoteDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} note={editingNote} onSave={handleSaveNote} />
      </div>
    </DashboardLayout>
  )
}
