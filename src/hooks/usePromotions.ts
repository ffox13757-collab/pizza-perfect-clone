import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Promotion {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async (): Promise<Promotion[]> => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return (data || []) as unknown as Promotion[];
    },
  });
}

export function useAllPromotions() {
  return useQuery({
    queryKey: ['all-promotions'],
    queryFn: async (): Promise<Promotion[]> => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return (data || []) as unknown as Promotion[];
    },
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('promotions').insert(promotion as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['all-promotions'] });
      toast.success('Promoção criada!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar promoção');
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...promotion }: Partial<Promotion> & { id: string }) => {
      const { error } = await supabase.from('promotions').update(promotion as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['all-promotions'] });
      toast.success('Promoção atualizada!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar promoção');
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['all-promotions'] });
      toast.success('Promoção removida!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover promoção');
    },
  });
}
