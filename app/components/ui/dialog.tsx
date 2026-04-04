"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

function DialogRoot(props: DialogPrimitive.Root.Props) {
    return <DialogPrimitive.Root {...props} />
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
    return <DialogPrimitive.Trigger {...props} />
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
    return <DialogPrimitive.Portal {...props} />
}

function DialogBackdrop({ className, ...props }: DialogPrimitive.Backdrop.Props) {
    return (
        <DialogPrimitive.Backdrop
            className={cn(
                "fixed inset-0 z-40 bg-black/60 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
                className,
            )}
            {...props}
        />
    )
}

function DialogPopup({ className, children, ...props }: DialogPrimitive.Popup.Props) {
    return (
        <DialogPrimitive.Popup
            className={cn(
                "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden transition-all data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
                className,
            )}
            {...props}
        >
            {children}
        </DialogPrimitive.Popup>
    )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
    return (
        <DialogPrimitive.Title
            className={cn(
                "font-sans text-base font-light text-muted-foreground px-5 py-4 border-b border-border",
                className,
            )}
            {...props}
        />
    )
}

function DialogClose({ className, ...props }: DialogPrimitive.Close.Props) {
    return (
        <DialogPrimitive.Close
            className={cn(
                "absolute top-2.5 right-4 text-[#555555] hover:text-foreground transition-colors",
                className,
            )}
            {...props}
        />
    )
}

function Dialog({
    trigger,
    title,
    children,
    open,
    onOpenChange,
}: {
    trigger?: React.ReactNode
    title: string
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    return (
        <DialogRoot open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger render={<span />}>{trigger}</DialogTrigger>}
            <DialogPortal>
                <DialogBackdrop />
                <DialogPopup>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogClose>
                        <X size={14} />
                    </DialogClose>
                    <div className="p-5">{children}</div>
                </DialogPopup>
            </DialogPortal>
        </DialogRoot>
    )
}

export {
    Dialog,
    DialogRoot,
    DialogTrigger,
    DialogPortal,
    DialogBackdrop,
    DialogPopup,
    DialogTitle,
    DialogClose,
}
