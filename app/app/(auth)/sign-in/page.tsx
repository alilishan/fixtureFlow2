"use client"

import { useActionState } from "react"
import { signInAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

export default function SignInPage() {
    const [error, action, pending] = useActionState(signInAction, null)

    return (
        <div className="bg-card border border-border p-8 rounded-lg shadow-float">
            <h1 className="font-mono font-semibold tracking-widest text-xl mb-1">SIGN IN</h1>
            <p className="text-sm text-muted-foreground mb-6">Admin access only</p>

            <form action={action} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="email"
                        className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="password"
                        className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                        Password
                    </label>
                    <PasswordInput
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        required
                    />
                </div>

                {error && (
                    <p className="text-xs text-destructive border border-destructive/30 bg-destructive/10 px-3 py-2">
                        {error}
                    </p>
                )}

                <Button type="submit" disabled={pending} className="mt-2 h-10 w-full">
                    {pending ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </div>
    )
}
