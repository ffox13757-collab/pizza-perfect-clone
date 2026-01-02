import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCoupons } from '@/hooks/useCoupons';
import { Clock, Flame, Copy, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function DailyOfferBanner() {
  const { data: coupons } = useCoupons();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);

  // Get the first active coupon as the daily offer
  const dailyOffer = coupons?.find(c => c.is_active);

  useEffect(() => {
    if (!dailyOffer?.valid_until) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = dailyOffer.valid_until 
        ? new Date(dailyOffer.valid_until) 
        : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [dailyOffer?.valid_until]);

  const handleCopyCode = () => {
    if (dailyOffer?.code) {
      navigator.clipboard.writeText(dailyOffer.code);
      setCopied(true);
      toast.success('Código copiado!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!dailyOffer) {
    return null;
  }

  const discountText = dailyOffer.discount_type === 'percentage'
    ? `${dailyOffer.discount_value}% OFF`
    : `R$ ${dailyOffer.discount_value} OFF`;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6 md:p-8">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
                <Flame className="h-4 w-4 animate-pulse" />
                Oferta do Dia
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                {discountText}
              </h3>
              <p className="text-white/80 mb-4">
                {dailyOffer.description || 'Use o cupom e economize no seu pedido!'}
              </p>
              
              {/* Coupon code button */}
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-mono font-bold text-lg transition-colors"
              >
                {dailyOffer.code}
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* Countdown */}
              <div className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Termina em:</span>
              </div>
              <div className="flex gap-2">
                {[
                  { value: timeLeft.hours, label: 'h' },
                  { value: timeLeft.minutes, label: 'm' },
                  { value: timeLeft.seconds, label: 's' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[3rem] text-center">
                      <span className="font-display text-2xl font-bold text-white">
                        {String(item.value).padStart(2, '0')}
                      </span>
                      <span className="text-white/70 text-xs ml-1">{item.label}</span>
                    </div>
                    {i < 2 && <span className="text-white/50 text-2xl mx-1">:</span>}
                  </div>
                ))}
              </div>

              <Link to="/menu">
                <Button variant="secondary" size="lg" className="group">
                  Aproveitar Agora
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
