import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"

interface NewNoteDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (note: { title: string; content: string }) => void
}

export default function NewNoteDialog({ open, onClose, onCreate }: NewNoteDialogProps) {
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setTitle("")
      setContent("")
    }
  }, [open])

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) return
    onCreate({ title: title.trim(), content: content.trim() })
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={open => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
        <DialogPrimitive.Content className="fixed top-[20%] left-[50%] max-w-lg w-full -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">New Note</h2>
            <p className="text-sm text-gray-600">Add a new note by filling the title and content.</p>
          </div>

          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleCreate}>Create</Button>
          </div>

          <DialogPrimitive.Close />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
