import {create} from "zustand";
import type {AuthSlice} from "~/store/features/auth/auth.types";
import {devtools, persist, subscribeWithSelector} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {createAuthSlice} from "~/store/features/auth/auth.slice";

export type AppState = AuthSlice
export const useAppStore = create<AppState>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((...args) => ({
                    ...createAuthSlice(...args),
                }))
            ),
            {name: "vite-app-store"}
        )
    )
);