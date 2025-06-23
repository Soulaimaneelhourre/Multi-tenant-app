export interface Note {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  user_id: number
}

export interface CreateNoteData {
  title: string
  content: string
}

export interface UpdateNoteData {
  title: string
  content: string
}
