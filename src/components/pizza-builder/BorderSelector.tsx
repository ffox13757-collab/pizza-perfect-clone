import { PizzaBorder } from '@/types/pizza';
import { cn } from '@/lib/utils';

interface BorderSelectorProps {
  borders: PizzaBorder[];
  selectedBorder: PizzaBorder | null;
  onSelect: (border: PizzaBorder) => void;
}

export function BorderSelector({ borders, selectedBorder, onSelect }: BorderSelectorProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Grátis';
    return `+ ${price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Escolha a Borda</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {borders.map((border) => (
          <button
            key={border.id}
            onClick={() => onSelect(border)}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all duration-300",
              "hover:border-primary hover:shadow-lg hover:scale-[1.02]",
              selectedBorder?.id === border.id
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card"
            )}
          >
            <div className="text-center">
              <p className="font-medium text-foreground">{border.name}</p>
              {border.description && (
                <p className="text-xs text-muted-foreground mt-1">{border.description}</p>
              )}
              <p className={cn(
                "text-sm font-semibold mt-2",
                border.additional_price === 0 ? "text-green-600" : "text-primary"
              )}>
                {formatPrice(border.additional_price)}
              </p>
            </div>
            {selectedBorder?.id === border.id && (
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
