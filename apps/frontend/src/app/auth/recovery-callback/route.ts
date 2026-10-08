import { createSupabaseServerClient } from "@/lib/supabase/server-client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code")

    if (!code) {
        return NextResponse.redirect(
            new URL("/forgot-password?error=recovery", request.url),
        )
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        return NextResponse.redirect(
            new URL("/forgot-password?error=recovery", request.url),
        )
    }

    const response = NextResponse.redirect(
        new URL("/reset-password", request.url),
    )

    response.cookies.set("fpl-suite-password-recovery", "1", {
        httpOnly: true,
        secure: request.nextUrl.protocol === "https:",
        sameSite: "lax",
        path: "/reset-password",
        maxAge: 10 * 60,
    })

    return response
}