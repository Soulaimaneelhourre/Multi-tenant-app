import type { Note } from "@/types/note"
import { NoteCard } from "./NoteCard"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText } from "lucide-react"

interface NotesListProps {
  notes: Note[]
  isLoading: boolean
  onEdit: (note: Note) => void
  onDelete: (id: number) => void
}

export function NotesList({ notes, isLoading, onEdit, onDelete }: NotesListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 p-6 border rounded-lg">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex justify-between items-center pt-4">
              <Skeleton className="h-3 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No notes yet</h3>
        <p className="mt-2 text-muted-foreground">Get started by creating your first note.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={() => onEdit(note)} onDelete={() => onDelete(note.id)} />
      ))}
    </div>
  )
}
