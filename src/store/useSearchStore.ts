import { create } from 'zustand';

type TSearchState = {
  searchResult: TSafe[] | undefined;
  setSearchResult: (searchResult: TSafe[] | undefined) => void;
};

const useSearchStore = create<TSearchState>((set, get) => ({
  searchResult: undefined,
  setSearchResult: (searchResult: TSafe[] | undefined) => set(() => ({ searchResult })),
}));

export default useSearchStore;
