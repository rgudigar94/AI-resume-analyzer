export type User = { id: string, name: string, email?: string, role?: string, isAdmin?: boolean, token: string };

export interface AuthState {
    user: User | null,
    isLoading: boolean,
    error?: string | null,
}

export interface AuthActions {
    signIn: (name: string) => void;
    signOut: () => void;
}

export type AuthSlice = AuthState & AuthActions;