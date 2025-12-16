import { ORDER_STATUS_CONFIG, OrderStatus } from '@/hooks/useOrders';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge = ({ status, size = 'md' }: OrderStatusBadgeProps) => {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full text-white font-medium',
        config.color,
        sizeClasses[size]
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};
