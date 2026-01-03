import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/database';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  addItemWithSize: (product: Product, sizeId: string, sizeName: string, price: number) => void;
  removeItem: (productId: string, sizeId?: string) => void;
  updateQuantity: (productId: string, quantity: number, sizeId?: string) => void;
  updateQuantityWithSize: (productId: string, sizeId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && !item.selectedSize
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && !item.selectedSize
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },

      addItemWithSize: (product: Product, sizeId: string, sizeName: string, price: number) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.selectedSize?.id === sizeId
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.selectedSize?.id === sizeId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: 1,
                selectedSize: { id: sizeId, name: sizeName, price },
              },
            ],
          };
        });
      },

      removeItem: (productId: string, sizeId?: string) => {
        set((state) => ({
          items: state.items.filter((item) => {
            if (item.product.id !== productId) return true;
            if (sizeId) return item.selectedSize?.id !== sizeId;
            return !!item.selectedSize; // Keep sized items if removing non-sized
          }),
        }));
      },

      updateQuantity: (productId: string, quantity: number, sizeId?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, sizeId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id !== productId) return item;
            if (sizeId) {
              return item.selectedSize?.id === sizeId ? { ...item, quantity } : item;
            }
            return !item.selectedSize ? { ...item, quantity } : item;
          }),
        }));
      },

      updateQuantityWithSize: (productId: string, sizeId: string, quantity: number) => {
        get().updateQuantity(productId, quantity, sizeId);
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.selectedSize?.price ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'pizza-cart',
    }
  )
);
