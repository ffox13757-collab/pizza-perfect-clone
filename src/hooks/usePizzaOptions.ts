import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PizzaSize, PizzaBorder, ProductPrice } from '@/types/pizza';

// Pizza Sizes
export function usePizzaSizes() {
  return useQuery({
    queryKey: ['pizza-sizes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pizza_sizes')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as PizzaSize[];
    },
  });
}

export function useAllPizzaSizes() {
  return useQuery({
    queryKey: ['pizza-sizes', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pizza_sizes')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as PizzaSize[];
    },
  });
}

export function useCreatePizzaSize() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (size: Omit<PizzaSize, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('pizza_sizes')
        .insert(size)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizza-sizes'] });
    },
  });
}

export function useUpdatePizzaSize() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...size }: Partial<PizzaSize> & { id: string }) => {
      const { data, error } = await supabase
        .from('pizza_sizes')
        .update(size)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizza-sizes'] });
    },
  });
}

export function useDeletePizzaSize() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pizza_sizes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizza-sizes'] });
    },
  });
}

// Pizza Borders
export function usePizzaBorders() {
  return useQuery({
    queryKey: ['pizza-borders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pizza_borders')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as PizzaBorder[];
    },
  });
}

export function useAllPizzaBorders() {
  return useQuery({
    queryKey: ['pizza-borders', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pizza_borders')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as PizzaBorder[];
    },
  });
}

export function useCreatePizzaBorder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (border: Omit<PizzaBorder, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('pizza_borders')
        .insert(border)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizza-borders'] });
    },
  });
}

export function useUpdatePizzaBorder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...border }: Partial<PizzaBorder> & { id: string }) => {
      const { data, error } = await supabase
        .from('pizza_borders')
        .update(border)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizza-borders'] });
    },
  });
}

export function useDeletePizzaBorder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pizza_borders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizza-borders'] });
    },
  });
}

// Product Prices
export function useProductPrices(productId?: string) {
  return useQuery({
    queryKey: ['product-prices', productId],
    queryFn: async () => {
      let query = supabase
        .from('product_prices')
        .select('*, pizza_sizes(*)');
      
      if (productId) {
        query = query.eq('product_id', productId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as (ProductPrice & { pizza_sizes: PizzaSize })[];
    },
    enabled: !!productId,
  });
}

export function useCreateProductPrice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (price: Omit<ProductPrice, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('product_prices')
        .insert(price)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-prices'] });
    },
  });
}

export function useUpdateProductPrice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...price }: Partial<ProductPrice> & { id: string }) => {
      const { data, error } = await supabase
        .from('product_prices')
        .update(price)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-prices'] });
    },
  });
}

export function useDeleteProductPrice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_prices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-prices'] });
    },
  });
}
