import { create } from 'zustand'
import { SessionStatus } from '@/types'

interface StudioStore {
  // Filters
  statusFilter: SessionStatus | 'all'
  searchQuery: string

  // UI State
  isCreateClientOpen: boolean
  selectedClientId: string | null

  // Actions
  setStatusFilter: (status: SessionStatus | 'all') => void
  setSearchQuery: (query: string) => void
  setCreateClientOpen: (open: boolean) => void
  setSelectedClientId: (id: string | null) => void
  resetFilters: () => void
}

export const useStudioStore = create<StudioStore>((set) => ({
  // Initial state
  statusFilter: 'all',
  searchQuery: '',
  isCreateClientOpen: false,
  selectedClientId: null,

  // Actions
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCreateClientOpen: (open) => set({ isCreateClientOpen: open }),
  setSelectedClientId: (id) => set({ selectedClientId: id }),
  resetFilters: () => set({ statusFilter: 'all', searchQuery: '' }),
}))
