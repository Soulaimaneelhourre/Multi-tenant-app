"use client"

import { useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import type { Note } from "@/types/note"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface NoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: Note | null
  onSave: (data: { title: string; content: string }) => Promise<void>
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").max(255, "Title is too long"),
  content: Yup.string().required("Content is required"),
})

export function NoteDialog({ open, onOpenChange, note, onSave }: NoteDialogProps) {
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSave(values)
      formik.resetForm()
    },
  })

  useEffect(() => {
    if (note) {
      formik.setValues({
        title: note.title,
        content: note.content,
      })
    } else {
      formik.resetForm()
    }
  }, [note, open])

  const handleClose = () => {
    onOpenChange(false)
    formik.resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "Create New Note"}</DialogTitle>
          <DialogDescription>
            {note ? "Make changes to your note here." : "Add a new note to your collection."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter note title" {...formik.getFieldProps("title")} />
              {formik.touched.title && formik.errors.title && (
                <p className="text-sm text-red-600">{formik.errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your note content here..."
                rows={6}
                {...formik.getFieldProps("content")}
              />
              {formik.touched.content && formik.errors.content && (
                <p className="text-sm text-red-600">{formik.errors.content}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Saving..." : note ? "Update Note" : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
