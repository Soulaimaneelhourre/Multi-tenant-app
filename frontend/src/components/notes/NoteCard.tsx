import type { Note } from "../../types/note"

interface Props {
  note: Note
  onDelete: (id: number) => void
  onUpdate: (note: Note) => void
}

export default function NoteCard({ note, onDelete, onUpdate }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
      <p className="text-gray-600 mb-4 break-words line-clamp-4 overflow-hidden" title={note.content}>
        {note.content}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{note.created_at}</span>
        <div className="space-x-2">
          <button onClick={() => onUpdate(note)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
          <button onClick={() => onDelete(note.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
        </div>
      </div>
    </div>
  )
}
