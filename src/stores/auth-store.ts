import { Customer, User } from "../schema";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
	accessToken: string | null;
	refreshToken: string | null;
	accessTokenExpiration: number | null;
	refreshTokenExpiration: number | null;
	user: User | null;
	customer: Customer | null;
	deviceToken: string;
};

type AuthActions = {
	setAuthData: (data: {
		accessToken: string;
		refreshToken?: string | null;
		accessTokenExpiration: number;
		refreshTokenExpiration?: number | null;
		user?: User | null;
		customer?: Customer | null;
		deviceToken?: string;
	}) => void;
	setCustomerData: (data: Customer) => void;
	setTokens: (accessToken: string, refreshToken: string) => void;
	clearAuth: () => void;
	isTokenExpired: () => boolean;
};

export type AuthStore = AuthState & AuthActions;

export function createAuthStore(initState: AuthState) {
	return createStore<AuthStore>()(
		persist(
			(set, get) => ({
				...initState,
				setAuthData: (data) =>
					set({
						accessToken: data.accessToken,
						refreshToken: data.refreshToken,
						accessTokenExpiration: data.accessTokenExpiration,
						refreshTokenExpiration: data.refreshTokenExpiration,
						user: data.user,
						customer: data.customer,
						deviceToken: data.deviceToken,
					}),
				setCustomerData: (data) => set({ customer: data }),
				setTokens: (accessToken: string, refreshToken: string) =>
					set({
						accessToken,
						refreshToken,
					}),
				clearAuth: () =>
					set({
						accessToken: null,
						refreshToken: null,
						accessTokenExpiration: null,
						refreshTokenExpiration: null,
						customer: null,
						user: null,
					}),
				isTokenExpired: () => {
					const state = get();
					if (!state.accessTokenExpiration) return false;
					return Date.now() >= state.accessTokenExpiration * 1000;
				},
			}),
			{
				name: "auth-storage",
			},
		),
	);
}
