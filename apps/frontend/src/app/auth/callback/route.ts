import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(
            new URL("/login?error=google", request.url),
        )
    };

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(
            new URL("/login?error=google", request.url),
        )
    };

    return NextResponse.redirect(
        new URL("/dashboard", request.url)
    );
}