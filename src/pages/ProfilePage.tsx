import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile, useCustomerOrders } from '@/hooks/useProfile';
import { useRealtimeOrders, OrderStatus } from '@/hooks/useOrders';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, User, Package, MapPin, Phone, Mail, Save, Eye, Star, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderTracker } from '@/components/orders/OrderTracker';
import { LoyaltyCard } from '@/components/loyalty/LoyaltyCard';
import { AddressList } from '@/components/address/AddressList';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: orders, isLoading: ordersLoading } = useCustomerOrders();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  
  useRealtimeOrders();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({ full_name: fullName, phone, address });
      toast.success('Perfil atualizado com sucesso!');
    } catch {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-bold mb-6">Minha Conta</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Fidelidade</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Endereços</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize suas informações de contato</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome completo" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="pl-10" />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={updateProfile.isPending} className="w-full md:w-auto">
                    {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pedidos</CardTitle>
                  <CardDescription>Acompanhe seus pedidos anteriores</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </div>
                            <OrderStatusBadge status={(order.status || 'pending') as OrderStatus} size="sm" />
                          </div>
                          <div className="space-y-1">
                            {order.order_items?.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.quantity}x {item.product_name}</span>
                                <span className="text-muted-foreground">{formatPrice(item.unit_price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-medium">Total</span>
                            <span className="font-bold text-primary">{formatPrice(order.total_amount)}</span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full"><Eye className="h-4 w-4 mr-2" />Acompanhar Pedido</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader><DialogTitle>Acompanhar Pedido</DialogTitle></DialogHeader>
                              <OrderTracker orderId={order.id} currentStatus={(order.status || 'pending') as OrderStatus} orderType={(order.order_type as 'delivery' | 'pickup') || 'delivery'} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Você ainda não fez nenhum pedido</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate('/menu')}>Ver Cardápio</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loyalty">
              <LoyaltyCard />
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Endereços</CardTitle>
                  <CardDescription>Gerencie seus endereços de entrega</CardDescription>
                </CardHeader>
                <CardContent>
                  <AddressList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
