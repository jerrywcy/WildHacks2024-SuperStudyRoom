import { Account } from "@prisma/client";
import { useAppSelector } from "../hooks";
import { makeStore } from "../store";
import { removeUser, setUser } from "../reducer/user";

export function useUserStore() {
  const state = useAppSelector((state) => state.user);
  const store = makeStore().store;

  return {
    state,
    getState: () => {
      return store.getState().user;
    },
    setUser: (user: Account) => {
      store.dispatch(setUser(user));
    },
    removeUser: () => {
      store.dispatch(removeUser());
    },
  };
}
