import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { applyCookieLifetime, AUTH_PERSISTENCE_COOKIE } from "@/lib/supabase/cookie-policy";

function getEnvironmentVariables() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        );
    }

    return { supabaseUrl, supabaseAnonKey }
}

export async function createSupabaseServerClient() {
    const { supabaseUrl, supabaseAnonKey } = getEnvironmentVariables();
    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                const rememberMe = cookieStore.get(AUTH_PERSISTENCE_COOKIE)?.value === "persistent";

                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, applyCookieLifetime(options, rememberMe))
                    );
                } catch (error) {
                    console.log(error)
                }
            }
        }
    })

}