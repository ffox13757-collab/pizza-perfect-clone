import { useState, useMemo } from 'react';
import { usePizzaSizes, usePizzaBorders } from '@/hooks/usePizzaOptions';
import { useProducts } from '@/hooks/useProducts';
import { SizeSelector } from './SizeSelector';
import { BorderSelector } from './BorderSelector';
import { FlavorSelector } from './FlavorSelector';
import { PizzaSize, PizzaBorder, PizzaSelection } from '@/types/pizza';
import { Product } from '@/types/database';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PizzaBuilderProps {
  onAddToCart: (selection: PizzaSelection, totalPrice: number) => void;
}

export function PizzaBuilder({ onAddToCart }: PizzaBuilderProps) {
  const { data: sizes, isLoading: sizesLoading } = usePizzaSizes();
  const { data: borders, isLoading: bordersLoading } = usePizzaBorders();
  const { data: products, isLoading: productsLoading } = useProducts();

  const [selectedSize, setSelectedSize] = useState<PizzaSize | null>(null);
  const [selectedBorder, setSelectedBorder] = useState<PizzaBorder | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<Array<{ product: Product; fraction: number }>>([]);

  const isLoading = sizesLoading || bordersLoading || productsLoading;

  // Filter only pizza products (assuming pizzas have a category)
  const pizzaProducts = useMemo(() => {
    return products?.filter(p => p.is_active) || [];
  }, [products]);

  // Calculate fraction for each flavor based on count
  const updateFlavorFractions = (flavors: Array<{ product: Product; fraction: number }>) => {
    const count = flavors.length;
    if (count === 0) return [];
    
    const fraction = 1 / count;
    return flavors.map(f => ({ ...f, fraction }));
  };

  const handleAddFlavor = (product: Product) => {
    const maxFlavors = selectedSize?.max_flavors || 1;
    if (selectedFlavors.length >= maxFlavors) {
      toast.error(`Máximo de ${maxFlavors} sabores para este tamanho`);
      return;
    }

    const newFlavors = [...selectedFlavors, { product, fraction: 1 }];
    setSelectedFlavors(updateFlavorFractions(newFlavors));
  };

  const handleRemoveFlavor = (productId: string) => {
    const newFlavors = selectedFlavors.filter(f => f.product.id !== productId);
    setSelectedFlavors(updateFlavorFractions(newFlavors));
  };

  const handleSizeChange = (size: PizzaSize) => {
    setSelectedSize(size);
    // Remove excess flavors if new size has lower limit
    if (selectedFlavors.length > size.max_flavors) {
      const trimmedFlavors = selectedFlavors.slice(0, size.max_flavors);
      setSelectedFlavors(updateFlavorFractions(trimmedFlavors));
    }
  };

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!selectedSize || selectedFlavors.length === 0) return 0;

    // Get the highest price among selected flavors
    const maxFlavorPrice = Math.max(...selectedFlavors.map(f => f.product.price));
    
    // Apply size multiplier
    const basePrice = maxFlavorPrice * selectedSize.price_multiplier;
    
    // Add border price
    const borderPrice = selectedBorder?.additional_price || 0;

    return basePrice + borderPrice;
  }, [selectedSize, selectedFlavors, selectedBorder]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const canAddToCart = selectedSize && selectedBorder && selectedFlavors.length > 0;

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    const selection: PizzaSelection = {
      size: selectedSize,
      border: selectedBorder,
      flavors: selectedFlavors,
    };

    onAddToCart(selection, totalPrice);

    // Reset form
    setSelectedSize(null);
    setSelectedBorder(null);
    setSelectedFlavors([]);

    toast.success('Pizza adicionada ao carrinho!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Size */}
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            1
          </span>
          <span className="text-muted-foreground">Passo 1 de 3</span>
        </div>
        {sizes && (
          <SizeSelector
            sizes={sizes}
            selectedSize={selectedSize}
            onSelect={handleSizeChange}
          />
        )}
      </div>

      {/* Step 2: Border */}
      {selectedSize && (
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </span>
            <span className="text-muted-foreground">Passo 2 de 3</span>
          </div>
          {borders && (
            <BorderSelector
              borders={borders}
              selectedBorder={selectedBorder}
              onSelect={setSelectedBorder}
            />
          )}
        </div>
      )}

      {/* Step 3: Flavors */}
      {selectedSize && selectedBorder && (
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </span>
            <span className="text-muted-foreground">Passo 3 de 3</span>
          </div>
          <FlavorSelector
            products={pizzaProducts}
            selectedFlavors={selectedFlavors}
            selectedSize={selectedSize}
            onAddFlavor={handleAddFlavor}
            onRemoveFlavor={handleRemoveFlavor}
          />
        </div>
      )}

      {/* Summary and Add to Cart */}
      {canAddToCart && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 shadow-lg border border-primary/20 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Sua Pizza</h3>
              <p className="text-muted-foreground">
                {selectedSize.name} • {selectedBorder.name} • {selectedFlavors.map(f => f.product.name).join(' + ')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</p>
              </div>
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="gap-2 px-8"
              >
                <ShoppingCart className="w-5 h-5" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
