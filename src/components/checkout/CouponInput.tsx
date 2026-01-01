import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useValidateCoupon, Coupon } from '@/hooks/useCoupons';
import { Loader2, Tag, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CouponInputProps {
  orderTotal: number;
  appliedCoupon: { coupon: Coupon; discount: number } | null;
  onApply: (result: { coupon: Coupon; discount: number } | null) => void;
}

export function CouponInput({ orderTotal, appliedCoupon, onApply }: CouponInputProps) {
  const [code, setCode] = useState('');
  const validateCoupon = useValidateCoupon();

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Digite o código do cupom');
      return;
    }

    try {
      const result = await validateCoupon.mutateAsync({ code: code.trim(), orderTotal });
      onApply(result);
      toast.success('Cupom aplicado com sucesso!');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleRemove = () => {
    onApply(null);
    setCode('');
    toast.info('Cupom removido');
  };

  if (appliedCoupon) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium text-sm">{appliedCoupon.coupon.code}</p>
                <p className="text-xs text-muted-foreground">
                  {appliedCoupon.coupon.discount_type === 'percentage'
                    ? `${appliedCoupon.coupon.discount_value}% de desconto`
                    : `R$ ${appliedCoupon.coupon.discount_value.toFixed(2)} de desconto`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">
                -R$ {appliedCoupon.discount.toFixed(2)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Código do cupom"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="pl-9"
        />
      </div>
      <Button
        variant="outline"
        onClick={handleApply}
        disabled={validateCoupon.isPending}
      >
        {validateCoupon.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Aplicar'
        )}
      </Button>
    </div>
  );
}
