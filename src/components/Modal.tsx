import { X } from 'lucide-react'
import { useId, useLayoutEffect, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const titleId = useId()
  useLayoutEffect(() => {
    const dialog = dialogRef.current!
    const trigger = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      // Wait for the commit to remove completed/deleted rows before restoring focus.
      queueMicrotask(() => {
        if (document.querySelector('dialog[open]')) return
        const returnFocus = trigger instanceof HTMLElement && trigger.isConnected ? trigger : document.getElementById('main-content')
        returnFocus?.focus({ preventScroll: true })
      })
    }
  }, [])

  useLayoutEffect(() => {
    if (!dialogRef.current?.contains(document.activeElement)) headingRef.current?.focus()
  }, [title])

  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]')]
      .filter((element) => !element.matches(':disabled') && element.tabIndex >= 0 && element.getClientRects().length > 0)
    const first = controls[0]
    const last = controls.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return createPortal(
    <dialog ref={dialogRef} className="modal" aria-labelledby={titleId} onKeyDown={containFocus} onCancel={(event) => { event.preventDefault(); onClose() }}>
      <div className="modal-header">
        <h2 ref={headingRef} tabIndex={-1} id={titleId}>{title}</h2>
        <button type="button" className="modal-close" aria-label="Close dialog" title="Close" onClick={onClose}><X size={20} aria-hidden="true" /></button>
      </div>
      {children}
    </dialog>,
    document.body,
  )
}
