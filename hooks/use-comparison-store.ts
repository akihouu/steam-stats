import { create } from "zustand"

interface ComparisonStore {
  selectedFriendIds: string[]
  toggleFriend: (steamid: string) => void
  clearSelection: () => void
  sortStat: string
  setSortStat: (stat: string) => void
}

export const useComparisonStore = create<ComparisonStore>((set) => ({
  selectedFriendIds: [],
  toggleFriend: (steamid) =>
    set((state) => ({
      selectedFriendIds: state.selectedFriendIds.includes(steamid)
        ? state.selectedFriendIds.filter((id) => id !== steamid)
        : [...state.selectedFriendIds, steamid],
    })),
  clearSelection: () => set({ selectedFriendIds: [] }),
  sortStat: "totalKills",
  setSortStat: (stat) => set({ sortStat: stat }),
}))
