import { PaymentMethod } from '@/hooks/usePaymentMethods';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, CreditCard, QrCode, Ticket } from 'lucide-react';

interface PaymentSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  changeFor: string;
  onChangeForUpdate: (value: string) => void;
  totalAmount: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Banknote,
  CreditCard,
  QrCode,
  Ticket,
};

export function PaymentSelector({
  methods,
  selectedMethod,
  onSelect,
  changeFor,
  onChangeForUpdate,
  totalAmount,
}: PaymentSelectorProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Forma de Pagamento</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methods.map((method) => {
          const IconComponent = iconMap[method.icon || 'Banknote'] || Banknote;
          
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method)}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300 text-left",
                "hover:border-primary hover:shadow-lg",
                selectedMethod?.id === method.id
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-card"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  selectedMethod?.id === method.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{method.name}</p>
                  {method.description && (
                    <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                  )}
                </div>
              </div>
              
              {selectedMethod?.id === method.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedMethod?.requires_change && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-3 animate-fade-in">
          <Label htmlFor="changeFor">Troco para quanto?</Label>
          <div className="flex items-center gap-3">
            <Input
              id="changeFor"
              type="number"
              step="0.01"
              min={totalAmount}
              value={changeFor}
              onChange={(e) => onChangeForUpdate(e.target.value)}
              placeholder="Ex: 100.00"
              className="max-w-[200px]"
            />
            <span className="text-sm text-muted-foreground">
              Total do pedido: {formatPrice(totalAmount)}
            </span>
          </div>
          {changeFor && parseFloat(changeFor) >= totalAmount && (
            <p className="text-sm text-green-600 font-medium">
              Troco: {formatPrice(parseFloat(changeFor) - totalAmount)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
