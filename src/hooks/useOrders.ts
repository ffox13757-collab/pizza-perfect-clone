import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: OrderStatus;
  notes: string | null;
  payment_method: string | null;
  change_for: number | null;
  delivery_zone_id: string | null;
  delivery_fee: number;
  order_type: 'delivery' | 'pickup' | 'dine_in';
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  notes: string | null;
  changed_by: string | null;
  created_at: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-500', icon: '⏳' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-500', icon: '✓' },
  preparing: { label: 'Preparando', color: 'bg-orange-500', icon: '👨‍🍳' },
  ready: { label: 'Pronto', color: 'bg-green-500', icon: '✅' },
  delivering: { label: 'Saiu para Entrega', color: 'bg-purple-500', icon: '🚚' },
  delivered: { label: 'Entregue', color: 'bg-emerald-600', icon: '🎉' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500', icon: '❌' },
};

export const useOrders = (status?: OrderStatus | 'all') => {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useUserOrders = () => {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useOrderStatusHistory = (orderId: string) => {
  return useQuery({
    queryKey: ['order-status-history', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as OrderStatusHistory[];
    },
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status, notes }: { orderId: string; status: OrderStatus; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();

      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Add to status history
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status,
          notes,
          changed_by: user?.id,
        });

      if (historyError) throw historyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-status-history'] });
      toast.success('Status atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar status: ' + error.message);
    },
  });
};

export const useRealtimeOrders = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['user-orders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
