import { useAppSelector } from "../../hooks/reduxHooks"
import type { Note } from "../../types/note"
import { Button } from "../ui/button"
import { FiEdit2, FiTrash2 } from "react-icons/fi" // Feather icons, for example
import { selectUser } from "../../store/authSlice"; // or wherever user data is stored


interface Props {
  note: Note
  onDelete: (id: number) => void
  onUpdate: (note: Note) => void
}

export default function NoteCard({ note, onDelete, onUpdate }: Props) {
  const user = useAppSelector(selectUser);
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
      <p
        className="text-gray-600 mb-4 break-words line-clamp-4 overflow-hidden"
        title={note.content}
      >
        {note.content}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
  {new Date(note.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}
</span>
{ user && user.id === note.user_id && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate(note)}
            className="flex items-center space-x-1"
          >
            <FiEdit2 />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(note.id)}
            className="flex items-center space-x-1 bg-red-500"
          >
            <FiTrash2 />
            <span>Delete</span>
          </Button>
        </div>)}
      </div>
    </div>
  )
}