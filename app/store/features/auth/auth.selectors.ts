import type {AppState} from "~/store";

const selectUser = (s: AppState) => s.user
const selectIsLoading = (s: AppState) => s.isLoading
const selectSignIn = (s: AppState) => s.signIn;
const selectSignOut = (s: AppState) => s.signOut;
export {selectIsLoading, selectUser, selectSignIn, selectSignOut}