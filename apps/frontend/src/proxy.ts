import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server-client";

export async function proxy(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Redirect non-authenticated users away from protected routes
    if (!user && (pathname.startsWith("/dashboard") || pathname === "/dashboard" )) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
}