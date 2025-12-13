import { Plus, Minus, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/database';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const defaultPizzaImage = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop';

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddItem = () => {
    addItem(product);
    toast.success(`${product.name} adicionada ao carrinho!`, {
      duration: 2000,
      position: 'bottom-center',
    });
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover-lift border border-border/50">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image_url || defaultPizzaImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {product.is_vegetarian && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
            <Leaf className="h-3 w-3" />
            Veggie
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-medium shadow-md animate-pulse-slow">
            ⭐ Destaque
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>

          {quantity === 0 ? (
            <Button 
              size="sm" 
              onClick={handleAddItem}
              className="group/btn"
            >
              <Plus className="h-4 w-4 mr-1 group-hover/btn:rotate-90 transition-transform" />
              Adicionar
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-muted rounded-full p-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold w-6 text-center">{quantity}</span>
              <Button
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
