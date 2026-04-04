"use client"

import { useActionState } from "react"
import { changePasswordAction } from "@/lib/actions/auth"
import { PasswordInput } from "@/components/ui/password-input"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ChangePasswordForm() {
    const [state, action, pending] = useActionState(changePasswordAction, null)

    return (
        <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                    Your Email
                </label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="currentPassword" className="text-xs uppercase tracking-widest text-muted-foreground">
                    Current Password
                </label>
                <PasswordInput id="currentPassword" name="currentPassword" required />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="newPassword" className="text-xs uppercase tracking-widest text-muted-foreground">
                    New Password
                </label>
                <PasswordInput id="newPassword" name="newPassword" required />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-xs uppercase tracking-widest text-muted-foreground">
                    Confirm New Password
                </label>
                <PasswordInput id="confirmPassword" name="confirmPassword" required />
            </div>

            {state?.error && (
                <p className="text-xs text-destructive border border-destructive/30 bg-destructive/10 px-3 py-2 rounded-sm">
                    {state.error}
                </p>
            )}
            {state?.success && (
                <p className="text-xs text-green-700 dark:text-green-400 border border-green-500/30 bg-green-500/10 px-3 py-2 rounded-sm">
                    {state.success}
                </p>
            )}

            <div>
                <Button type="submit" disabled={pending}>
                    {pending ? "Saving…" : "Change Password"}
                </Button>
            </div>
        </form>
    )
}
