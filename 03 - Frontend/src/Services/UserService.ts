import store from "../Redux/Store";

export const isUserLoggedIn = () => (store.getState().authState.user);
export const isItTheAdminUser = () => (store.getState().authState.user.role === "admin");