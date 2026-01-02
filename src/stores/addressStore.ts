import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SelectedAddress {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface AddressStore {
  selectedAddress: SelectedAddress | null;
  hasCheckedCep: boolean;
  setSelectedAddress: (address: SelectedAddress | null) => void;
  setHasCheckedCep: (checked: boolean) => void;
  clearAddress: () => void;
  getFormattedAddress: () => string;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      selectedAddress: null,
      hasCheckedCep: false,

      setSelectedAddress: (address) => set({ selectedAddress: address }),
      
      setHasCheckedCep: (checked) => set({ hasCheckedCep: checked }),
      
      clearAddress: () => set({ selectedAddress: null, hasCheckedCep: false }),
      
      getFormattedAddress: () => {
        const address = get().selectedAddress;
        if (!address) return '';
        
        const parts = [
          address.street,
          address.number,
          address.complement,
          address.neighborhood,
          address.city,
          address.state,
        ].filter(Boolean);
        
        return parts.join(', ');
      },
    }),
    {
      name: 'pizza-address',
    }
  )
);
