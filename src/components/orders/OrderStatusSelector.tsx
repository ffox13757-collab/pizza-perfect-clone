import { useState } from 'react';
import { ORDER_STATUS_CONFIG, OrderStatus, useUpdateOrderStatus } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw } from 'lucide-react';

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];

export const OrderStatusSelector = ({ orderId, currentStatus }: OrderStatusSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>(currentStatus);
  const [notes, setNotes] = useState('');
  const updateStatus = useUpdateOrderStatus();

  const handleUpdate = async () => {
    await updateStatus.mutateAsync({ orderId, status: newStatus, notes: notes || undefined });
    setIsOpen(false);
    setNotes('');
  };

  // Quick action buttons for common status changes
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const flow: Record<OrderStatus, OrderStatus | null> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivering',
      delivering: 'delivered',
      delivered: null,
      cancelled: null,
    };
    return flow[current];
  };

  const nextStatus = getNextStatus(currentStatus);

  return (
    <div className="flex items-center gap-2">
      {nextStatus && (
        <Button
          size="sm"
          onClick={() => updateStatus.mutate({ orderId, status: nextStatus })}
          disabled={updateStatus.isPending}
          className="gap-1"
        >
          {updateStatus.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <span>{ORDER_STATUS_CONFIG[nextStatus].icon}</span>
          )}
          {ORDER_STATUS_CONFIG[nextStatus].label}
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-3 w-3 mr-1" />
            Alterar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status do Pedido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Novo Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      <span className="flex items-center gap-2">
                        <span>{ORDER_STATUS_CONFIG[status].icon}</span>
                        <span>{ORDER_STATUS_CONFIG[status].label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Observação (opcional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Cliente solicitou mais molho"
                rows={3}
              />
            </div>

            <Button
              onClick={handleUpdate}
              disabled={updateStatus.isPending || newStatus === currentStatus}
              className="w-full"
            >
              {updateStatus.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Atualizar Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
