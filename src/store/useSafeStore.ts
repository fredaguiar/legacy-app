import { create } from 'zustand';

type TSafeState = {
  safeId: string | null;
  setSafeId: (user: string | undefined) => void;
};

const useSafeStore = create<TSafeState>((set) => ({
  safeId: null,
  setSafeId: (safeId: string | undefined) => set(() => ({ safeId })),
}));

export default useSafeStore;
