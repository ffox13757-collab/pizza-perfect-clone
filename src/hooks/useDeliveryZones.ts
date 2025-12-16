import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DeliveryZone {
  id: string;
  name: string;
  neighborhoods: string[];
  delivery_fee: number;
  estimated_time_min: number;
  estimated_time_max: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useDeliveryZones = () => {
  return useQuery({
    queryKey: ['delivery-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as DeliveryZone[];
    },
  });
};

export const useAllDeliveryZones = () => {
  return useQuery({
    queryKey: ['all-delivery-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as DeliveryZone[];
    },
  });
};

export const useCreateDeliveryZone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (zone: Omit<DeliveryZone, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('delivery_zones')
        .insert(zone)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-zones'] });
      queryClient.invalidateQueries({ queryKey: ['all-delivery-zones'] });
      toast.success('Zona de entrega criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar zona de entrega: ' + error.message);
    },
  });
};

export const useUpdateDeliveryZone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DeliveryZone> & { id: string }) => {
      const { data, error } = await supabase
        .from('delivery_zones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-zones'] });
      queryClient.invalidateQueries({ queryKey: ['all-delivery-zones'] });
      toast.success('Zona de entrega atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar zona de entrega: ' + error.message);
    },
  });
};

export const useDeleteDeliveryZone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('delivery_zones')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-zones'] });
      queryClient.invalidateQueries({ queryKey: ['all-delivery-zones'] });
      toast.success('Zona de entrega removida com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover zona de entrega: ' + error.message);
    },
  });
};
