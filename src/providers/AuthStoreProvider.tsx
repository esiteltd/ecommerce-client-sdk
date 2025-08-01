"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type AuthStore, createAuthStore } from "../stores/auth-store";
import { v4 } from "uuid";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
	undefined,
);

function getDeviceIdentifier() {
	if (typeof window === "undefined") return "";

	const cached = localStorage.getItem("device_identifier");

	if (cached) return cached;

	const newToken = v4();
	localStorage.setItem("device_identifier", newToken);
	return newToken;
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

// This function should be used only in client-only components and functions
export function getAccessToken() {
	return globalRef?.getState().accessToken;
}

// This function should be used only in client-only components and functions
export function getDeviceToken() {
	return globalRef?.getState().deviceToken;
}

// This function should be used only in client-only components and functions
// Should be removed from the code
export function getExternalUserId() {
	return globalRef?.getState().user?.id;
}

// This function should be used only in client-only components and functions
// Should be removed from the code
export function getCustomerId() {
	return globalRef?.getState().customer?.id;
}

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
	const authStoreContext = useContext(AuthStoreContext);

	if (!authStoreContext) {
		throw new Error(`useAuthStore must be used within AuthStoreProvider`);
	}

	return useStore(authStoreContext, selector);
};
