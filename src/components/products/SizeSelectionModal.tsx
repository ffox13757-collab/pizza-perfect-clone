import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Product } from '@/types/database';
import { usePizzaSizes, useProductPrices } from '@/hooks/usePizzaOptions';
import { Loader2, ShoppingCart } from 'lucide-react';

interface SizeSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onAddToCart: (product: Product, sizeId: string, sizeName: string, price: number) => void;
}

export function SizeSelectionModal({
  open,
  onOpenChange,
  product,
  onAddToCart,
}: SizeSelectionModalProps) {
  const { data: sizes, isLoading: sizesLoading } = usePizzaSizes();
  const { data: productPrices, isLoading: pricesLoading } = useProductPrices(product.id);
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');

  const isLoading = sizesLoading || pricesLoading;

  // Build a map of size prices for this product
  const sizePriceMap = new Map<string, number>();
  productPrices?.forEach((pp) => {
    sizePriceMap.set(pp.size_id, Number(pp.price));
  });

  // Filter sizes that have prices for this product
  const availableSizes = sizes?.filter((size) => sizePriceMap.has(size.id)) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleConfirm = () => {
    if (!selectedSizeId) return;
    const selectedSize = availableSizes.find((s) => s.id === selectedSizeId);
    const price = sizePriceMap.get(selectedSizeId);
    if (selectedSize && price) {
      onAddToCart(product, selectedSizeId, selectedSize.name, price);
      onOpenChange(false);
      setSelectedSizeId('');
    }
  };

  const selectedPrice = selectedSizeId ? sizePriceMap.get(selectedSizeId) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🍕</span>
            {product.name}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : availableSizes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Nenhum tamanho disponível para este produto.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Escolha o tamanho da sua pizza:
            </p>

            <RadioGroup value={selectedSizeId} onValueChange={setSelectedSizeId}>
              <div className="space-y-2">
                {availableSizes.map((size) => {
                  const price = sizePriceMap.get(size.id)!;
                  return (
                    <Label
                      key={size.id}
                      htmlFor={size.id}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedSizeId === size.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={size.id} id={size.id} />
                        <div>
                          <span className="font-medium">{size.name}</span>
                          {size.description && (
                            <p className="text-xs text-muted-foreground">{size.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Até {size.max_flavors} {size.max_flavors === 1 ? 'sabor' : 'sabores'}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">{formatPrice(price)}</span>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedSizeId}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar {selectedPrice ? formatPrice(selectedPrice) : ''}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
