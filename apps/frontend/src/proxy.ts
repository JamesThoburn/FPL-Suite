import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import {
    applyCookieLifetime,
    AUTH_PERSISTENCE_COOKIE,
} from "@/lib/supabase/cookie-policy"

export async function proxy(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("MISSING NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
    }

    let response = NextResponse.next({ request })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet, headers) {
                const rememberMe =
                    request.cookies.get(AUTH_PERSISTENCE_COOKIE)?.value === "persistent"

                for (const { name, value } of cookiesToSet) {
                    request.cookies.set(name, value)
                }

                response = NextResponse.next({ request })

                for (const { name, value, options } of cookiesToSet) {
                    response.cookies.set(
                        name,
                        value,
                        applyCookieLifetime(options, rememberMe),
                    )
                }

                for (const [name, value] of Object.entries(headers)) {
                    response.headers.set(name, value)
                }
            },
        },
    })

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isDashboard =
        request.nextUrl.pathname === "/dashboard" ||
        request.nextUrl.pathname.startsWith("/dashboard/")

    if (!user && isDashboard) {
        const redirectResponse = NextResponse.redirect(
            new URL("/login", request.url),
        )

        for (const cookie of response.cookies.getAll()) {
            redirectResponse.cookies.set(cookie)
        }

        return redirectResponse
    }

    return response
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
}