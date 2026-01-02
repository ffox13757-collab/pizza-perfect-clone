import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface LoyaltyPoints {
  id: string;
  user_id: string;
  total_points: number;
  lifetime_points: number;
  orders_count: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  order_id: string | null;
  points: number;
  transaction_type: 'earned' | 'redeemed' | 'expired';
  description: string | null;
  created_at: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string | null;
  points_required: number;
  reward_type: 'discount' | 'free_item' | 'free_pizza';
  reward_value: number | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useLoyaltyPoints = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['loyalty-points', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as LoyaltyPoints | null;
    },
    enabled: !!user,
  });
};

export const useLoyaltyTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['loyalty-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as LoyaltyTransaction[];
    },
    enabled: !!user,
  });
};

export const useLoyaltyRewards = () => {
  return useQuery({
    queryKey: ['loyalty-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data as LoyaltyReward[];
    },
  });
};

export const useAllLoyaltyRewards = () => {
  return useQuery({
    queryKey: ['all-loyalty-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .order('display_order');

      if (error) throw error;
      return data as LoyaltyReward[];
    },
  });
};

export const useCreateLoyaltyReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reward: Omit<LoyaltyReward, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .insert(reward)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['all-loyalty-rewards'] });
    },
  });
};

export const useUpdateLoyaltyReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LoyaltyReward> & { id: string }) => {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['all-loyalty-rewards'] });
    },
  });
};

export const useDeleteLoyaltyReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('loyalty_rewards')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['all-loyalty-rewards'] });
    },
  });
};

export const useEarnPoints = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, orderTotal, userId, points, description }: { 
      orderId?: string; 
      orderTotal?: number;
      userId?: string;
      points?: number;
      description?: string;
    }) => {
      const targetUserId = userId || user?.id;
      if (!targetUserId) throw new Error('Usuário não autenticado');

      // Calculate points (1 point per R$1 spent)
      const pointsEarned = points ?? (orderTotal ? Math.floor(orderTotal) : 0);
      if (pointsEarned <= 0) return 0;

      // Check if loyalty points record exists
      const { data: existing } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (existing) {
        // Update existing points
        await supabase
          .from('loyalty_points')
          .update({
            total_points: existing.total_points + pointsEarned,
            lifetime_points: existing.lifetime_points + pointsEarned,
            orders_count: existing.orders_count + 1,
          })
          .eq('user_id', targetUserId);
      } else {
        // Create new record
        await supabase
          .from('loyalty_points')
          .insert({
            user_id: targetUserId,
            total_points: pointsEarned,
            lifetime_points: pointsEarned,
            orders_count: 1,
          });
      }

      // Record transaction
      await supabase
        .from('loyalty_transactions')
        .insert({
          user_id: targetUserId,
          order_id: orderId || null,
          points: pointsEarned,
          transaction_type: 'earned',
          description: description || `Pontos ganhos no pedido`,
        });

      return pointsEarned;
    },
    onSuccess: (points) => {
      if (points > 0) {
        queryClient.invalidateQueries({ queryKey: ['loyalty-points'] });
        queryClient.invalidateQueries({ queryKey: ['loyalty-transactions'] });
      }
    },
  });
};

export const useRedeemReward = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reward: LoyaltyReward) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar pontos disponíveis
      const { data: loyalty } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!loyalty || loyalty.total_points < reward.points_required) {
        throw new Error('Pontos insuficientes');
      }

      // Deduzir pontos
      await supabase
        .from('loyalty_points')
        .update({
          total_points: loyalty.total_points - reward.points_required,
        })
        .eq('user_id', user.id);

      // Registrar transação
      await supabase
        .from('loyalty_transactions')
        .insert({
          user_id: user.id,
          points: -reward.points_required,
          transaction_type: 'redeemed',
          description: `Resgatou: ${reward.name}`,
        });

      return reward;
    },
    onSuccess: (reward) => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-points'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-transactions'] });
      toast.success(`Você resgatou: ${reward.name}!`);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};
