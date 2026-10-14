"use client";

import { SubmitEvent, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { getProfile, saveProfile } from "@/lib/profile-api";

type ProfileModalProps = {
    onClose: () => void;
    onSaved: (displayName: string) => void;
};

type FieldErrors = {
    displayName?: string;
    fplManagerId?: string;
};

export default function ProfileModal({
    onClose,
    onSaved,
}: ProfileModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [displayName, setDisplayName] = useState("");
    const [managerId, setManagerId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadAttempt, setLoadAttempt] = useState(0);
    const [loadError, setLoadError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (dialog && !dialog.open) {
            dialog.showModal();
        }

        return () => {
            if (dialog?.open) {
                dialog.close();
            }
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            setLoadError("");

            try {
                const profile = await getProfile();

                if (cancelled) return;

                setDisplayName(profile.displayName);
                setManagerId(
                    profile.fplManagerId === null ? "" : String(profile.fplManagerId),
                );
            } catch (error) {
                if (cancelled) return;

                setLoadError(
                    error instanceof Error
                        ? error.message
                        : "Could not load your profile. Please retry.",
                );
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [loadAttempt]);

    function validate(): { valid: boolean; fplManagerId: number | null } {
        const errors: FieldErrors = {};
        const trimmedName = displayName.trim();

        if (!trimmedName) {
            errors.displayName = "Enter your display name.";
        } else if (trimmedName.length > 80) {
            errors.displayName = "Your display name must be 80 characters or fewer.";
        }

        let fplManagerId: number | null = null;
        const trimmedManagerId = managerId.trim();

        if (trimmedManagerId) {
            const parsed = Number(trimmedManagerId);

            if (
                !/^\d+$/.test(trimmedManagerId) ||
                !Number.isSafeInteger(parsed) ||
                parsed <= 0
            ) {
                errors.fplManagerId = "Enter a positive whole-number FPL manager ID.";
            } else {
                fplManagerId = parsed;
            }
        }

        setFieldErrors(errors);
        return {
            valid: Object.keys(errors).length === 0,
            fplManagerId
        };
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaveError("");
        setSaved(false);

        const validation = validate();

        if (!validation.valid) {
            return;
        }

        const trimmedName = displayName.trim();
        setIsSaving(true);

        try {
            const profile = await saveProfile({
                displayName: trimmedName,
                fplManagerId: validation.fplManagerId,
            });

            setDisplayName(profile.displayName);
            setManagerId(
                profile.fplManagerId === null ? "" : String(profile.fplManagerId),
            );
            onSaved(profile.displayName);
            setSaved(true);
        } catch (error) {
            setSaveError(
                error instanceof Error
                    ? error.message
                    : "Could not save your profile. Please try again.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="profile-dialog-title"
            className="m-auto w-[min(100%-2rem,28rem)] rounded-lg border border-border-default bg-surface-card text-text-primary shadow-2xl backdrop:bg-black/45"
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="p-6">
                <div className="mb-2.5 text-[8px] font-bold tracking-[1.9px] text-text-eyebrow">
                    YOUR FPL WORKSPACE
                </div>

                <div className="flex items-start justify-between gap-4">
                    <h2 id="profile-dialog-title" className="text-xl font-semibold">
                        Your profile
                    </h2>
                    <button
                        type="button"
                        aria-label="Close profile"
                        className="rounded p-1 text-text-muted hover:bg-surface-nav-item-hover"
                        onClick={onClose}
                    >
                        <Icon name="close" size={18} />
                    </button>
                </div>

                <p className="mt-2 text-sm text-text-muted">
                    Update the details that personalise your FPL workspace.
                </p>

                {isLoading ? (
                    <p className="mt-6 text-sm text-text-muted" role="status">
                        Loading your profile…
                    </p>
                ) : loadError ? (
                    <div className="mt-6">
                        <p className="text-sm text-red-700" role="alert">
                            {loadError}
                        </p>
                        <button
                            type="button"
                            className="mt-4 rounded-[5px] border border-border-default px-4 py-2 text-sm font-medium"
                            onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <form className="mt-5" onSubmit={handleSubmit} noValidate>
                        <label
                            htmlFor="profile-display-name"
                            className="block text-[10px] text-text-form-label"
                        >
                            Display name
                            <input
                                id="profile-display-name"
                                name="displayName"
                                type="text"
                                autoComplete="name"
                                maxLength={80}
                                required
                                value={displayName}
                                onChange={(event) => {
                                    setDisplayName(event.target.value);
                                    setFieldErrors((errors) => ({
                                        ...errors,
                                        displayName: undefined,
                                    }));
                                }}
                                aria-invalid={Boolean(fieldErrors.displayName)}
                                aria-describedby={
                                    fieldErrors.displayName
                                        ? "profile-name-error"
                                        : undefined
                                }
                                className="mt-2 block w-full rounded border border-border-form-label-input bg-surface-card p-3 text-[13px] text-text-form-label-input"
                            />
                        </label>
                        {fieldErrors.displayName && (
                            <p
                                id="profile-name-error"
                                className="mt-1.5 text-xs text-red-700"
                                role="alert"
                            >
                                {fieldErrors.displayName}
                            </p>
                        )}

                        <label
                            htmlFor="profile-manager-id"
                            className="mt-5.5 block text-[10px] text-text-form-label"
                        >
                            FPL manager ID
                            <span className="ml-1 text-text-muted">(optional)</span>
                            <input
                                id="profile-manager-id"
                                name="fplManagerId"
                                type="text"
                                inputMode="numeric"
                                value={managerId}
                                onChange={(event) => {
                                    setManagerId(event.target.value);
                                    setFieldErrors((errors) => ({
                                        ...errors,
                                        fplManagerId: undefined,
                                    }));
                                }}
                                aria-invalid={Boolean(fieldErrors.fplManagerId)}
                                aria-describedby={
                                    fieldErrors.fplManagerId
                                        ? "profile-manager-error"
                                        : undefined
                                }
                                placeholder="e.g. 124508"
                                className="mt-2 block w-full rounded border border-border-form-label-input bg-surface-card p-3 text-[13px] text-text-form-label-input"
                            />
                        </label>
                        {fieldErrors.fplManagerId && (
                            <p
                                id="profile-manager-error"
                                className="mt-1.5 text-xs text-red-700"
                                role="alert"
                            >
                                {fieldErrors.fplManagerId}
                            </p>
                        )}

                        {saveError && (
                            <p className="mt-4 text-sm text-red-700" role="alert">
                                {saveError}
                            </p>
                        )}
                        {saved && (
                            <p className="mt-4 text-sm text-green-700" role="status">
                                Your profile has been saved.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="mt-6 flex w-full items-center justify-between gap-5 rounded-[5px] bg-action-primary px-4 py-3.25 text-xs text-white hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? "Saving changes…" : "Save changes"}
                            <Icon name="arrow" size={18} />
                        </button>

                        <p className="mt-4.25! text-[10px]! text-text-data-note!">
                            Your profile details are only used to personalise your FPL
                            Suite workspace.
                        </p>
                    </form>
                )}
            </div>
        </dialog>
    );
}