import type {StateCreator} from "zustand";

export type Middleware = [
    ["zustand/immer", never],
    ["zustand/subscribeWithSelector", never],
    ["zustand/devtools", never],
    ["zustand/persist", unknown]
];

/**
 * Slice type helper
 */
export type Slice<T> = StateCreator<T,
// @ts-ignore
    Middleware,
    [],
    T>;
