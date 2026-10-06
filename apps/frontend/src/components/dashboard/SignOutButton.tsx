"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSignOut() {
        setIsSigningOut(true);
        setErrorMessage("");

        try {
            const { error } = await getSupabaseBrowserClient().auth.signOut();

            if (error) {
                setErrorMessage("Sign out failed. Please try again.");
                setIsSigningOut(false);
                return;
            }

            router.replace("/login");
            router.refresh();
        } catch {
            setErrorMessage("Unable to sign out right now. Please try again.");
            setIsSigningOut(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
            >
                {isSigningOut ? "Signing out…" : "Sign out"}
            </button>
            {errorMessage && (
                <p className="mt-2 text-sm text-red-700" role="alert">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
