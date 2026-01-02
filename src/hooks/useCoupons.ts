import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_uses: number | null;
  uses_count: number;
  max_uses_per_user: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Coupon[];
    },
  });
};

export const useAllCoupons = () => {
  return useQuery({
    queryKey: ['all-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Coupon[];
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coupon: { code: string; description?: string; discount_type: 'percentage' | 'fixed'; discount_value: number; min_order_value?: number; max_uses?: number | null; max_uses_per_user?: number; valid_until?: string | null; is_active?: boolean }) => {
      const { data, error } = await supabase
        .from('coupons')
        .insert([coupon])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Coupon> & { id: string }) => {
      const { data, error } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useValidateCoupon = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      // Buscar cupom pelo código
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        throw new Error('Cupom não encontrado ou inválido');
      }

      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

      // Verificar validade temporal
      if (now < validFrom) {
        throw new Error('Este cupom ainda não está válido');
      }

      if (validUntil && now > validUntil) {
        throw new Error('Este cupom expirou');
      }

      // Verificar limite de usos total
      if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
        throw new Error('Este cupom atingiu o limite de usos');
      }

      // Verificar valor mínimo do pedido
      if (orderTotal < coupon.min_order_value) {
        throw new Error(`Valor mínimo do pedido: R$ ${coupon.min_order_value.toFixed(2)}`);
      }

      // Verificar uso por usuário
      if (user && coupon.max_uses_per_user) {
        const { count } = await supabase
          .from('coupon_uses')
          .select('*', { count: 'exact', head: true })
          .eq('coupon_id', coupon.id)
          .eq('user_id', user.id);

        if (count && count >= coupon.max_uses_per_user) {
          throw new Error('Você já utilizou este cupom o máximo de vezes permitido');
        }
      }

      // Calcular desconto
      let discount = 0;
      if (coupon.discount_type === 'percentage') {
        discount = (orderTotal * coupon.discount_value) / 100;
      } else {
        discount = coupon.discount_value;
      }

      return {
        coupon: coupon as Coupon,
        discount: Math.min(discount, orderTotal),
      };
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};

export const useApplyCoupon = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ couponId, orderId, userId }: { couponId: string; orderId?: string; userId?: string }) => {
      const targetUserId = userId || user?.id;
      if (!targetUserId) throw new Error('Usuário não autenticado');

      // Register coupon use
      const { error: useError } = await supabase
        .from('coupon_uses')
        .insert({
          coupon_id: couponId,
          user_id: targetUserId,
          order_id: orderId || null,
        });

      if (useError) throw useError;

      // Increment uses count
      const { data: coupon } = await supabase
        .from('coupons')
        .select('uses_count')
        .eq('id', couponId)
        .single();

      if (coupon) {
        await supabase
          .from('coupons')
          .update({ uses_count: (coupon.uses_count || 0) + 1 })
          .eq('id', couponId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};
