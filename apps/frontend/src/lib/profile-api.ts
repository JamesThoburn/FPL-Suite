import { getSupabaseBrowserClient } from "./supabase/browser-client";

export type Profile = {
    displayName: string;
    fplManagerId: number | null;
};

function isProfile(value: unknown): value is Profile {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const profile = value as Record<string, unknown>;

    return (
        typeof profile.displayName === "string" &&
        (profile.fplManagerId === null ||
            (typeof profile.fplManagerId === "number" &&
                Number.isSafeInteger(profile.fplManagerId) &&
                profile.fplManagerId > 0))
    );
}

async function getApiError(response: Response): Promise<Error> {
    let body: unknown;

    try {
        body = await response.json();
    } catch {
        body = null;
    }

    if (typeof body === "object" && body !== null && "detail" in body && typeof body.detail === "string") {
        return new Error(body.detail);
    }

    if (response.status === 401) {
        return new Error("Your session has expired. Please sign in again.");
    }

    return new Error(`The profile service returned an error (${response.status})`);
}

async function requestProfile(
    method: "GET" | "PUT",
    body?: { displayName: string; fplManagerId: number | null }
): Promise<Profile> {
    const apiBaseUrl = process.env.NEXT_PUBLIC_JAVA_API_BASE_URL;

    if (!apiBaseUrl) {
        throw new Error("Missing NEXT_PUBLIC_JAVA_API_BASE_URL");
    }

    const {
        data: { session },
        error: sessionError,
    } = await getSupabaseBrowserClient().auth.getSession();

    if (sessionError) {
        throw new Error("Could not retrieve your sign-in session.");
    }

    const accessToken = session?.access_token;

    if (!accessToken) {
        throw new Error("Your session has expired. Please sign in again.");
    }

    const response = await fetch(
        `${apiBaseUrl.replace(/\/$/, "")}/api/v1/profile`,
        {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                ...(body ? { "Content-Type": "application/json" } : {}),
            },
            ...(body ? { body: JSON.stringify(body) }: {}),
            cache: "no-store",
            signal: AbortSignal.timeout(10000)
        }
    );

    if (!response.ok) {
        throw await getApiError(response);
    }

    const result: unknown = await response.json();

    if (!isProfile(result)) {
        throw new Error("The profile service returned invalid data.");
    }

    return result;
}

export function getProfile(): Promise<Profile> {
    return requestProfile("GET");
}

export function saveProfile(profile: Profile): Promise<Profile> {
    return requestProfile("PUT", profile);
}