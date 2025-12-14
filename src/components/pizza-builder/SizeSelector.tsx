import { PizzaSize } from '@/types/pizza';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: PizzaSize[];
  selectedSize: PizzaSize | null;
  onSelect: (size: PizzaSize) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Escolha o Tamanho</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSelect(size)}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all duration-300",
              "hover:border-primary hover:shadow-lg hover:scale-[1.02]",
              selectedSize?.id === size.id
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card"
            )}
          >
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">{size.code}</span>
              <p className="font-medium text-foreground mt-1">{size.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{size.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Até {size.max_flavors} {size.max_flavors === 1 ? 'sabor' : 'sabores'}
              </p>
            </div>
            {selectedSize?.id === size.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
