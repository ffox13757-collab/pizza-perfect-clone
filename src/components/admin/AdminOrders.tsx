import { useState } from 'react';
import { useOrders, useRealtimeOrders, OrderStatus, ORDER_STATUS_CONFIG } from '@/hooks/useOrders';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderStatusSelector } from '@/components/orders/OrderStatusSelector';
import { Loader2, Package, Phone, MapPin, CreditCard, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const { data: orders, isLoading } = useOrders(statusFilter);
  
  // Enable realtime updates
  useRealtimeOrders();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group orders by status for quick overview
  const ordersByStatus = orders?.reduce((acc, order) => {
    const status = order.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">Pedidos</h2>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos ({orders?.length || 0})</SelectItem>
              {Object.entries(ORDER_STATUS_CONFIG).map(([status, config]) => (
                <SelectItem key={status} value={status}>
                  <span className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                    <span className="text-muted-foreground">({ordersByStatus[status] || 0})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['pending', 'preparing', 'ready', 'delivering'] as OrderStatus[]).map((status) => {
          const config = ORDER_STATUS_CONFIG[status];
          const count = ordersByStatus[status] || 0;
          return (
            <Card 
              key={status} 
              className={`cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === status ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <div className="font-bold text-xl">{count}</div>
                  <div className="text-xs text-muted-foreground">{config.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {order.customer_name}
                      <OrderStatusBadge status={order.status} size="sm" />
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {order.customer_phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(order.created_at), "dd/MM HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">
                        {order.order_type === 'pickup' ? 'Retirada no local' : order.customer_address}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver itens ({order.order_items?.length || 0} itens)
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Itens do Pedido</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                            <span>{item.quantity}x {item.product_name}</span>
                            <span className="font-medium">{formatPrice(item.unit_price * item.quantity)}</span>
                          </div>
                        ))}
                        {order.delivery_fee > 0 && (
                          <div className="flex justify-between py-2 text-muted-foreground">
                            <span>Taxa de entrega</span>
                            <span>{formatPrice(order.delivery_fee)}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 font-bold text-lg border-t">
                          <span>Total</span>
                          <span className="text-primary">{formatPrice(order.total_amount)}</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Payment Info */}
                  {order.payment_method && (
                    <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                      <CreditCard className="h-4 w-4" />
                      <span>{order.payment_method}</span>
                      {order.change_for && (
                        <span className="text-muted-foreground">
                          (Troco para {formatPrice(order.change_for)})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {order.notes && (
                    <div className="text-sm bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded border border-yellow-200 dark:border-yellow-800">
                      📝 {order.notes}
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground text-sm">Total do pedido</span>
                    <span className="font-display font-bold text-xl text-primary">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-2">Nenhum pedido {statusFilter !== 'all' ? 'com esse status' : 'ainda'}</h3>
          <p className="text-muted-foreground">
            {statusFilter !== 'all' 
              ? 'Tente alterar o filtro para ver outros pedidos.'
              : 'Os pedidos aparecerão aqui quando os clientes fizerem compras.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
