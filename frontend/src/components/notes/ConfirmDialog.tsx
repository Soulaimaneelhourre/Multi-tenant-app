import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "../../components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={open => !open && onCancel()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
        <DialogPrimitive.Content className="fixed top-[20%] left-[50%] max-w-md w-full -translate-x-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="default" onClick={onConfirm}>
              Confirm
            </Button>
          </div>

          <DialogPrimitive.Close />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
