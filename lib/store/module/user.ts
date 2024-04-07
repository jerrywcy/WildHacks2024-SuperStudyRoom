import { Account } from "@prisma/client";
import { useAppSelector } from "../hooks";
import { makeStore } from "../store";
import { removeUser, setUser } from "../reducer/user";

export function useUserStore() {
  const state = useAppSelector((state) => state.user);
  const { store, persistor } = makeStore();

  return {
    state,
    getState: () => {
      return store.getState().user;
    },
    login: async (user: Account) => {
      await persistor.purge();
      store.dispatch(setUser(user));
    },
    logout: async () => {
      await persistor.purge();
      store.dispatch(removeUser());
    },
  };
}
