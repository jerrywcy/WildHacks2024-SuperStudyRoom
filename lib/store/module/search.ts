import { useAppSelector } from "../hooks";
import { makeStore } from "../store";
import { SearchFilters, removeSearch, setSearch } from "../reducer/search";

export function useSearchStore() {
  const state = useAppSelector((state) => state.search);
  const store = makeStore().store;

  return {
    state,
    getState: () => {
      if (!state.search) return undefined;
      const { date, start, end, capacity, time } = state.search;
      return {
        date: new Date(date),
        start: new Date(start),
        end: new Date(end),
        capacity,
        time,
      };
    },
    setSearch: ({ date, start, end, time, capacity }: SearchFilters) => {
      store.dispatch(
        setSearch({
          date: date.getTime(),
          start: start.getTime(),
          end: end.getTime(),
          time,
          capacity,
        }),
      );
    },
    removeSearch: () => {
      store.dispatch(removeSearch());
    },
  };
}
