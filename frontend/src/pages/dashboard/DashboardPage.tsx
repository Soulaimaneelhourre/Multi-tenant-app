// 📁 src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { selectToken, logout as logoutAction } from "../../store/authSlice";
import { selectSelectedTenant } from "../../store/tenantSlice";
import { useNavigate } from "react-router-dom";

import {
  fetchNotes,
  deleteNote,
  updateNote,
} from "../../services/notesService";
import NoteCard from "../../components/notes/NoteCard";
import EditNoteDialog from "../../components/notes/EditNoteDialog";
import ConfirmDialog from "../../components//notes/ConfirmDialog";
import NewNoteDialog from "../../components/notes/NewNoteDialog";
import { createNote } from "../../services/notesService";
import { selectUser } from "../../store/authSlice"; // or wherever user data is stored

import type { Note } from "../../types/note";
import { Badge } from "lucide-react";

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const user = useAppSelector(selectUser);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const token = useAppSelector(selectToken);
  const selectedTenant = useAppSelector(selectSelectedTenant);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [newNoteOpen, setNewNoteOpen] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      if (!selectedTenant || !token) {
        setError("Missing tenant or token");
        return;
      }
      try {
        const tenantDomain = selectedTenant.domains[0]?.domain;
        const fetchedNotes = await fetchNotes(token, tenantDomain);
        setNotes(fetchedNotes);
      } catch (err: any) {
        setError(err.message || "Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, [selectedTenant, token]);

  const handleCreateNote = async (noteData: {
    title: string;
    content: string;
  }) => {
    if (!token || !selectedTenant) return;
    try {
      const tenantDomain = selectedTenant.domains[0]?.domain;
      const newNote = await createNote(noteData, token, tenantDomain);
      setNotes((prev) => [newNote, ...prev]);
      setNewNoteOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to create note");
    }
  };

  const handleDelete = async () => {
    if (!noteToDelete || !token || !selectedTenant) return;
    try {
      const tenantDomain = selectedTenant.domains[0]?.domain;
      await deleteNote(noteToDelete.id, token, tenantDomain);
      setNotes(notes.filter((note) => note.id !== noteToDelete.id));
      setNoteToDelete(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete note");
    }
  };

  const handleUpdate = async (updatedNote: Note) => {
    if (!token || !selectedTenant) return;
    try {
      const tenantDomain = selectedTenant.domains[0]?.domain;
      const res = await updateNote(updatedNote, token, tenantDomain);
      setNotes(notes.map((n) => (n.id === res.id ? res : n)));
      setNoteToEdit(null);
    } catch (err: any) {
      setError(err.message || "Failed to update note");
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notes Dashboard
              </h1>
              <span className="text-gray-700 font-medium">
                Hello, {user?.name || "User"}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => setNewNoteOpen(true)}
              >
                New Note
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
              
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="text-gray-600 text-lg font-medium">Loading notes...</p>
  </div>
)}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && notes.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-600 text-lg font-medium">No notes available</p>
          </div>
        )}

        {!loading && !error && notes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={() => setNoteToDelete(note)}
                onUpdate={() => setNoteToEdit(note)}
              />
            ))}
          </div>
        )}
      </main>

      <EditNoteDialog
        open={!!noteToEdit}
        note={noteToEdit}
        onClose={() => setNoteToEdit(null)}
        onSave={handleUpdate}
      />

      <NewNoteDialog
        open={newNoteOpen}
        onClose={() => setNewNoteOpen(false)}
        onCreate={handleCreateNote}
      />
      <ConfirmDialog
        open={!!noteToDelete}
        title="Delete Note"
        description="Are you sure you want to delete this note?"
        onCancel={() => setNoteToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
