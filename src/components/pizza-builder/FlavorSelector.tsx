import { Product } from '@/types/database';
import { PizzaSize } from '@/types/pizza';
import { cn } from '@/lib/utils';
import { Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlavorSelection {
  product: Product;
  fraction: number;
}

interface FlavorSelectorProps {
  products: Product[];
  selectedFlavors: FlavorSelection[];
  selectedSize: PizzaSize | null;
  onAddFlavor: (product: Product) => void;
  onRemoveFlavor: (productId: string) => void;
}

export function FlavorSelector({ 
  products, 
  selectedFlavors, 
  selectedSize, 
  onAddFlavor, 
  onRemoveFlavor 
}: FlavorSelectorProps) {
  const maxFlavors = selectedSize?.max_flavors || 1;
  const currentFlavorsCount = selectedFlavors.length;
  const canAddMore = currentFlavorsCount < maxFlavors;

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getFractionLabel = (fraction: number) => {
    if (fraction === 1) return 'Inteira';
    if (fraction === 0.5) return '1/2';
    if (fraction === 0.33) return '1/3';
    if (fraction === 0.25) return '1/4';
    return `${Math.round(fraction * 100)}%`;
  };

  const isSelected = (productId: string) => {
    return selectedFlavors.some(f => f.product.id === productId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Escolha os Sabores</h3>
        <span className="text-sm text-muted-foreground">
          {currentFlavorsCount}/{maxFlavors} {maxFlavors === 1 ? 'sabor' : 'sabores'}
        </span>
      </div>

      {/* Selected Flavors */}
      {selectedFlavors.length > 0 && (
        <div className="bg-primary/5 rounded-xl p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Sabores selecionados:</p>
          <div className="flex flex-wrap gap-2">
            {selectedFlavors.map((flavor) => (
              <div
                key={flavor.product.id}
                className="flex items-center gap-2 bg-primary/20 text-primary rounded-full px-3 py-1"
              >
                <span className="text-sm font-medium">
                  {getFractionLabel(flavor.fraction)} {flavor.product.name}
                </span>
                <button
                  onClick={() => onRemoveFlavor(flavor.product.id)}
                  className="hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flavor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
        {products.map((product) => {
          const selected = isSelected(product.id);
          
          return (
            <div
              key={product.id}
              className={cn(
                "relative p-3 rounded-xl border-2 transition-all duration-300",
                selected
                  ? "border-primary bg-primary/10"
                  : canAddMore
                    ? "border-border bg-card hover:border-primary/50 hover:shadow-md cursor-pointer"
                    : "border-border bg-muted/50 opacity-50"
              )}
            >
              <div className="flex gap-3">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground text-sm line-clamp-1">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {product.description}
                        </p>
                      )}
                    </div>
                    {product.is_vegetarian && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex-shrink-0">
                        Veggie
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {selected ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRemoveFlavor(product.id)}
                        className="h-7 px-2"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    ) : canAddMore ? (
                      <Button
                        size="sm"
                        onClick={() => onAddFlavor(product)}
                        className="h-7 px-2"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
