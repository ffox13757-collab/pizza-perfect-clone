import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { PaymentSelector } from '@/components/checkout/PaymentSelector';
import { usePaymentMethods, PaymentMethod } from '@/hooks/usePaymentMethods';
import { toast } from 'sonner';

const defaultPizzaImage = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const { data: settings } = useSiteSettings();
  const { data: paymentMethods, isLoading: methodsLoading } = usePaymentMethods();
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [changeFor, setChangeFor] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const total = getTotalPrice();
  const deliveryFee = total >= 50 ? 0 : 5;
  const finalTotal = total + deliveryFee;

  const handleWhatsAppOrder = () => {
    if (!selectedPayment) {
      toast.error('Selecione uma forma de pagamento');
      return;
    }

    if (selectedPayment.requires_change && changeFor && parseFloat(changeFor) < finalTotal) {
      toast.error('O valor do troco deve ser maior que o total do pedido');
      return;
    }

    const orderItems = items.map(
      (item) => `• ${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}`
    ).join('\n');

    let paymentInfo = `💳 Pagamento: ${selectedPayment.name}`;
    if (selectedPayment.requires_change && changeFor) {
      paymentInfo += `\n💵 Troco para: ${formatPrice(parseFloat(changeFor))}`;
    }

    const message = `🍕 *Novo Pedido - ${settings?.site_name || "Mom's Pizza"}*\n\n${orderItems}\n\n📦 Subtotal: ${formatPrice(total)}\n🚚 Entrega: ${deliveryFee === 0 ? 'Grátis!' : formatPrice(deliveryFee)}\n\n${paymentInfo}\n\n💰 *Total: ${formatPrice(finalTotal)}*`;
    
    const whatsappUrl = `https://wa.me/${settings?.whatsapp || '5511999999999'}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Redirecionando para o WhatsApp...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 animate-slide-up">
            <Link to="/menu">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Seu Carrinho
              </h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-muted rounded-full mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                Carrinho Vazio
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Parece que você ainda não escolheu nenhuma pizza. Que tal explorar nosso cardápio?
              </p>
              <Link to="/menu">
                <Button variant="hero" size="lg" className="group">
                  Ver Cardápio
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img
                      src={item.product.image_url || defaultPizzaImage}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)} cada
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-muted rounded-full p-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <div className="font-display font-bold text-primary text-lg">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.product.id);
                          toast.success('Item removido do carrinho');
                        }}
                        className="text-destructive hover:text-destructive/80 text-sm flex items-center gap-1 mt-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remover
                      </button>
                    </div>
                  </div>
                ))}

                {/* Clear cart */}
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      clearCart();
                      toast.success('Carrinho limpo');
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar carrinho
                  </Button>
                </div>

                {/* Payment Methods */}
                {methodsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : paymentMethods && paymentMethods.length > 0 && (
                  <PaymentSelector
                    methods={paymentMethods}
                    selectedMethod={selectedPayment}
                    onSelect={setSelectedPayment}
                    changeFor={changeFor}
                    onChangeForUpdate={setChangeFor}
                    totalAmount={finalTotal}
                  />
                )}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 sticky top-24 animate-fade-in">
                  <h3 className="font-display text-lg font-bold mb-4">Resumo do Pedido</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entrega</span>
                      {deliveryFee === 0 ? (
                        <span className="text-accent font-medium">Grátis! 🎉</span>
                      ) : (
                        <span className="font-medium">{formatPrice(deliveryFee)}</span>
                      )}
                    </div>
                    {deliveryFee > 0 && (
                      <p className="text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                        💡 Faltam {formatPrice(50 - total)} para entrega grátis!
                      </p>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-display text-lg font-bold">Total</span>
                      <span className="font-display text-2xl font-bold text-primary">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full group"
                    onClick={handleWhatsAppOrder}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current mr-2">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Finalizar pelo WhatsApp
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Você será redirecionado para o WhatsApp para confirmar seu pedido
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
