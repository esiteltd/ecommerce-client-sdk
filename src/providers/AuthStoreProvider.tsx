"use client";
import React, {
	type ReactNode,
	createContext,
	useRef,
	useContext,
} from "react";
import { useStore } from "zustand";
import { type AuthStore, createAuthStore } from "../stores/auth-store";
import { v4 } from "uuid";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
	undefined,
);

function getDeviceIdentifier(): string {
	// Always return empty string during SSR
	if (typeof window === "undefined") return "";
	try {
		const cached = localStorage.getItem("device_identifier");
		if (cached) return cached;
		const newToken = v4();
		localStorage.setItem("device_identifier", newToken);
		return newToken;
	} catch (error) {
		// Handle cases where localStorage is not available (private browsing, etc.)
		console.warn(
			"localStorage not available, generating temporary device ID:",
			error,
		);
		return v4(); // Return a new token without caching
	}
}

let globalRef: AuthStoreApi | null = null;

export const AuthStoreProvider = ({ children }: { children: ReactNode }) => {
	const storeRef = useRef<AuthStoreApi | null>(null);
	if (!storeRef.current) {
		storeRef.current = createAuthStore({
			deviceToken: getDeviceIdentifier(),
			accessToken: null,
			refreshToken: null,
			accessTokenExpiration: null,
			refreshTokenExpiration: null,
			user: null,
			customer: null,
		});
		globalRef = storeRef.current;
	}
	return (
		<AuthStoreContext.Provider value={storeRef.current}>
			{children}
		</AuthStoreContext.Provider>
	);
};

// These functions should be used only in client-only components and functions
export function getAccessToken(): string | null {
	if (typeof window === "undefined") return null;
	return globalRef?.getState().accessToken ?? null;
}

export function getDeviceToken(): string | null {
	if (typeof window === "undefined") return null;
	return globalRef?.getState().deviceToken ?? getDeviceIdentifier();
}

export function getRefreshToken(): string | null {
	if (typeof window === "undefined") return null;
	return globalRef?.getState().refreshToken ?? null;
}

/**
 * Set both access token and refresh token globally
 * Used by the SDK to update tokens after refresh
 */
export function setTokens(accessToken: string, refreshToken: string): void {
	if (typeof window === "undefined") {
		console.warn("setTokens called during SSR, skipping");
		return;
	}
	globalRef?.getState().setTokens(accessToken, refreshToken);
}

// Should be removed from the code as noted in your original comment
export function getExternalUserId(): string | null {
	if (typeof window === "undefined") return null;
	return globalRef?.getState().user?.id ?? null;
}

// Should be removed from the code as noted in your original comment
export function getCustomerId(): string | null {
	if (typeof window === "undefined") return null;
	return globalRef?.getState().customer?.id ?? null;
}

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
	const authStoreContext = useContext(AuthStoreContext);
	if (!authStoreContext) {
		throw new Error(`useAuthStore must be used within AuthStoreProvider`);
	}
	return useStore(authStoreContext, selector);
};
