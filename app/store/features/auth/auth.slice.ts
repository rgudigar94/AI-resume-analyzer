import type {Slice} from "~/store/types";
import type {AuthSlice, AuthState} from "~/store/features/auth/auth.types";
import {nanoid} from 'nanoid'


export const createAuthSlice: Slice<AuthSlice> = (set) => {
    return {
        user: null,
        error: null,
        isLoading: false,
        signIn: (name) => {
            // @ts-ignore
            set((s: AuthState) => {
                s.isLoading = true;
                s.error = undefined;
            });

            // Simulate async login
            setTimeout(() => {
                // @ts-ignore
                set((s: AuthState) => {
                    s.user = {id: nanoid(), name, token: "jwt_" + nanoid(6)};
                    s.isLoading = false;
                });
            }, 500);
        },
        signOut: () => {
            // @ts-ignore
            set((s: AuthState) => {
                s.user = null;
            });
        },
    };
}