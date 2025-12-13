import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const defaultPizzaImage = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const { data: settings } = useSiteSettings();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const total = getTotalPrice();

  const handleWhatsAppOrder = () => {
    const orderItems = items.map(
      (item) => `- ${item.quantity}x ${item.product.name} (${formatPrice(item.product.price * item.quantity)})`
    ).join('\n');

    const message = `🍕 *Novo Pedido*\n\n${orderItems}\n\n*Total: ${formatPrice(total)}*`;
    const whatsappUrl = `https://wa.me/${settings?.whatsapp || '5511999999999'}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Seu Carrinho
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                Carrinho Vazio
              </h2>
              <p className="text-muted-foreground mb-6">
                Você ainda não adicionou nenhuma pizza ao carrinho.
              </p>
              <Link to="/menu">
                <Button variant="hero">
                  Ver Cardápio
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm"
                  >
                    <img
                      src={item.product.image_url || defaultPizzaImage}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)} cada
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <div className="font-display font-bold text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-destructive hover:text-destructive/80 text-sm flex items-center gap-1 mt-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Entrega</span>
                  <span className="text-accent font-medium">A combinar</span>
                </div>
                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-display text-lg font-bold">Total</span>
                    <span className="font-display text-2xl font-bold text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={clearCart} className="flex-1">
                    Limpar Carrinho
                  </Button>
                  <Button variant="hero" onClick={handleWhatsAppOrder} className="flex-1">
                    Finalizar pelo WhatsApp
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
