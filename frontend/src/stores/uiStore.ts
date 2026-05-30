import { create } from 'zustand';

export interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  modals: {},

  openModal: (id) =>
    set((state) => ({
      modals: { ...state.modals, [id]: true },
    })),

  closeModal: (id) =>
    set((state) => ({
      modals: { ...state.modals, [id]: false },
    })),

  closeAllModals: () => set({ modals: {} }),
}));
