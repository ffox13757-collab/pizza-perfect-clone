import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Sparkles } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

interface Promotion {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  display_order: number;
}

export function PromotionsCarousel() {
  const { data: promotions, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: async (): Promise<Promotion[]> => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-bold">Promoções</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!promotions || promotions.length === 0) {
    return null;
  }

  const defaultImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=300&fit=crop';

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <h2 className="font-display text-2xl font-bold">Promoções Especiais</h2>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {promotions.map((promo) => (
              <CarouselItem key={promo.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="group relative h-48 rounded-2xl overflow-hidden bg-card shadow-sm border border-border/50 hover:shadow-lg transition-shadow">
                  <img
                    src={promo.image_url || defaultImage}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-lg font-bold text-white mb-1">
                      {promo.title}
                    </h3>
                    {promo.subtitle && (
                      <p className="text-sm text-white/80 mb-3 line-clamp-1">
                        {promo.subtitle}
                      </p>
                    )}
                    {promo.link_url && (
                      <Link to={promo.link_url}>
                        <Button size="sm" variant="secondary" className="group/btn">
                          Ver oferta
                          <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {promotions.length > 3 && (
            <>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
