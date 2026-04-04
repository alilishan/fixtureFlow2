import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard") && !isLoggedIn) {
        return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    // Redirect logged-in users away from sign-in
    if (pathname === "/sign-in" && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|embed).*)"],
}
