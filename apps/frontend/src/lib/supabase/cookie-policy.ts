type CookieLifetime = {
    maxAge?: number
    expires?: Date
}

export const AUTH_PERSISTENCE_COOKIE = "fpl-suite-auth-persistence"

export function applyCookieLifetime<T extends CookieLifetime>(options: T, rememberMe: boolean): T {
    // Preserve cookie deletion options, such as maxAge: 0.
    if (rememberMe || (options.maxAge !== undefined && options.maxAge <= 0)) {
        return options;
    }

    const sessionCookieOptions = { ...options };
    delete sessionCookieOptions.maxAge;
    delete sessionCookieOptions.expires;

    return sessionCookieOptions;
}