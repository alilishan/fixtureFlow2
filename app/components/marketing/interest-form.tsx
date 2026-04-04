"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useTransition } from "react"
import { submitInterestAction } from "@/lib/actions/interest"
import { ArrowRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const schema = z.object({
    name:     z.string().min(1, "Name is required"),
    email:    z.string().min(1, "Email is required").email("Enter a valid email address"),
    clubName: z.string().optional(),
    message:  z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
    if (!message) return null
    return <p className="text-xs text-destructive mt-1">{message}</p>
}

function Field({
    label,
    error,
    children,
}: {
    label: string
    error?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
            {children}
            <FieldError message={error} />
        </div>
    )
}

const inputCls = (hasError?: boolean) =>
    cn(
        "h-11 px-4 bg-card border text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors rounded-md",
        hasError ? "border-destructive focus:border-destructive" : "border-border focus:border-ring"
    )

export function InterestForm({ variant = "default" }: { variant?: "default" | "compact" }) {
    const [serverError, setServerError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isPending, startTransition] = useTransition()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    function onSubmit(values: FormValues) {
        setServerError(null)
        const formData = new FormData()
        formData.set("name", values.name)
        formData.set("email", values.email)
        if (values.clubName) formData.set("clubName", values.clubName)
        if (values.message) formData.set("message", values.message)

        startTransition(async () => {
            const result = await submitInterestAction(null, formData)
            if (result?.success) setSuccess(true)
            else if (result?.error) setServerError(result.error)
        })
    }

    if (success) {
        return (
            <div className="flex items-center gap-2.5 text-sm text-foreground">
                <CheckCircle size={16} className="text-primary shrink-0" />
                <span>You&apos;re on the list — we&apos;ll be in touch.</span>
            </div>
        )
    }

    const isCompact = variant === "compact"

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <div className={cn("grid gap-4", isCompact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
                <Field label="Your name" error={errors.name?.message}>
                    <input
                        {...register("name")}
                        type="text"
                        placeholder="John Doe"
                        className={inputCls(!!errors.name)}
                    />
                </Field>
                <Field label="Email address" error={errors.email?.message}>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        className={inputCls(!!errors.email)}
                    />
                </Field>
            </div>

            <Field label="Club name (optional)" error={errors.clubName?.message}>
                <input
                    {...register("clubName")}
                    type="text"
                    placeholder="e.g. Rovers FC"
                    className={inputCls(!!errors.clubName)}
                />
            </Field>

            {!isCompact && (
                <Field label="Anything else? (optional)" error={errors.message?.message}>
                    <textarea
                        {...register("message")}
                        placeholder="How many teams do you manage? Any specific needs?"
                        rows={3}
                        className={cn(inputCls(!!errors.message), "h-auto py-3 resize-none")}
                    />
                </Field>
            )}

            {serverError && (
                <p className="text-xs text-destructive border border-destructive/30 bg-destructive/10 px-3 py-2 rounded-md">
                    {serverError}
                </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <button
                    type="submit"
                    disabled={isPending}
                    className="h-11 px-6 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
                >
                    {isPending ? "Sending…" : "Get early access"}
                    {!isPending && <ArrowRight size={14} />}
                </button>
                <p className="text-xs text-muted-foreground">No spam. No credit card. Just early access.</p>
            </div>
        </form>
    )
}
