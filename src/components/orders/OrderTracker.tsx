import { ORDER_STATUS_CONFIG, OrderStatus, useOrderStatusHistory } from '@/hooks/useOrders';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Circle } from 'lucide-react';

interface OrderTrackerProps {
  orderId: string;
  currentStatus: OrderStatus;
  orderType: 'delivery' | 'pickup' | 'dine_in';
}

const DELIVERY_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
const PICKUP_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

export const OrderTracker = ({ orderId, currentStatus, orderType }: OrderTrackerProps) => {
  const { data: history } = useOrderStatusHistory(orderId);
  
  const steps = orderType === 'pickup' ? PICKUP_STEPS : DELIVERY_STEPS;
  const currentIndex = steps.indexOf(currentStatus);
  
  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <span className="text-2xl mb-2 block">❌</span>
        <p className="font-medium text-red-700 dark:text-red-400">Pedido Cancelado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="relative">
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const config = ORDER_STATUS_CONFIG[step];
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const historyEntry = history?.find(h => h.status === step);

            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all',
                    isCompleted
                      ? config.color + ' text-white'
                      : 'bg-muted text-muted-foreground',
                    isCurrent && 'ring-4 ring-primary/30 animate-pulse'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <span className={cn(
                  'text-xs mt-2 text-center font-medium',
                  isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {config.label}
                </span>
                {historyEntry && (
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(historyEntry.created_at), 'HH:mm', { locale: ptBR })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0 mx-8">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Status History */}
      {history && history.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-3 text-sm">Histórico</h4>
          <div className="space-y-2">
            {history.map((entry) => {
              const config = ORDER_STATUS_CONFIG[entry.status as OrderStatus];
              return (
                <div key={entry.id} className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground text-xs w-14">
                    {format(new Date(entry.created_at), 'HH:mm', { locale: ptBR })}
                  </span>
                  <span className="text-lg">{config?.icon}</span>
                  <span>{config?.label || entry.status}</span>
                  {entry.notes && (
                    <span className="text-muted-foreground">- {entry.notes}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
