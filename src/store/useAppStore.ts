
import { create } from 'zustand';
import { UserEntity, ProjectEntity, ProductEntity, OrderEntity, TokenEntity } from '../core/schemas/entities';
import * as api from '../core/api/contract';

interface AppState {
  // User State
  user: UserEntity | null;
  userTokens: TokenEntity[];
  setUser: (user: UserEntity | null) => void;
  setUserTokens: (tokens: TokenEntity[]) => void;
  
  // Project State
  projects: ProjectEntity[];
  publicProjects: ProjectEntity[];
  setProjects: (projects: ProjectEntity[]) => void;
  setPublicProjects: (projects: ProjectEntity[]) => void;
  addProject: (project: ProjectEntity) => void;
  updateProject: (project: ProjectEntity) => void;

  // Cart State
  cart: { product: ProductEntity; quantity: number }[];
  addToCart: (product: ProductEntity) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, newProduct: ProductEntity) => void;
  clearCart: () => void;

  // Global Actions
  refreshUserData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User
  user: null,
  userTokens: api.mockUserTokens,
  setUser: (user) => set({ user }),
  setUserTokens: (userTokens) => set({ userTokens }),

  // Projects
  projects: [],
  publicProjects: [],
  setProjects: (projects) => set({ projects }),
  setPublicProjects: (publicProjects) => set({ publicProjects }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (project) => set((state) => ({
    projects: state.projects.map((p) => (p.id === project.id ? project : p)),
  })),

  // Cart
  cart: [],
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.product.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { cart: [...state.cart, { product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.product.id !== productId),
  })),
  updateCartItem: (productId, newProduct) => set((state) => ({
    cart: state.cart.map((item) => item.product.id === productId ? { ...item, product: newProduct } : item)
  })),
  clearCart: () => set({ cart: [] }),

  // Actions
  refreshUserData: async () => {
    const [user, projects, orders] = await Promise.all([
      api.authenticateWithPi(),
      api.listProjects(),
      api.listOrders(),
    ]);
    set({ user, projects });
  },
}));
