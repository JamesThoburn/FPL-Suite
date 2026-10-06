"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { parseCookie, stringifySetCookie } from "cookie";
import { applyCookieLifetime, AUTH_PERSISTENCE_COOKIE } from "./cookie-policy";

type SupabaseSchema = Record<string, never>;

let client: SupabaseClient<SupabaseSchema> | null = null;

function getBrowserCookies() {
    if (typeof document === "undefined") {
        return []
    }

    return Object.entries(parseCookie(document.cookie)).map(([name, value]) => ({
        name,
        value: value ?? "",
    }))
}

export function getSupabaseBrowserClient(): SupabaseClient<SupabaseSchema> {
    if (client) {
        return client;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        );
    }

    client = createBrowserClient<SupabaseSchema>(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return getBrowserCookies()
            },
            setAll(cookiesToSet) {
                if (typeof document === "undefined") {
                    return
                }

                const rememberMe = parseCookie(document.cookie)[AUTH_PERSISTENCE_COOKIE] === "persistent";

                for (const { name, value, options } of cookiesToSet) {
                    document.cookie = stringifySetCookie({
                        name,
                        value,
                        ...applyCookieLifetime(options, rememberMe),
                    })
                }
            }
        }
    });
    return client;
}