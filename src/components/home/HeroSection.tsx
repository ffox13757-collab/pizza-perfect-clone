import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  const { data: settings } = useSiteSettings();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-warm">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>🔥</span>
              <span>Pedido Mínimo R$ 30</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {settings?.hero_title || 'Pizza Artesanal com Sabor de Casa'}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              {settings?.hero_subtitle ||
                'Feita com ingredientes frescos e muito amor. Entrega rápida para você saborear quentinha.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/menu">
                <Button variant="hero" size="xl">
                  Ver Cardápio
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${settings?.whatsapp || '5511999999999'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="xl">
                  📞 Pedir pelo WhatsApp
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 justify-center lg:justify-start">
              <div>
                <div className="font-display text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Pedidos/mês</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">Avaliação</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-primary">30min</div>
                <div className="text-sm text-muted-foreground">Entrega média</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-float hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-hero rounded-full blur-3xl opacity-20" />
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop"
                alt="Pizza deliciosa"
                className="relative w-full h-full object-cover rounded-full shadow-2xl"
              />
              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 bg-card shadow-lg rounded-xl p-3 animate-pulse-slow">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍕</span>
                  <div>
                    <div className="font-semibold text-sm">Margherita</div>
                    <div className="text-xs text-muted-foreground">Mais pedida!</div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 bottom-1/4 bg-card shadow-lg rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="font-semibold text-sm">5 estrelas</div>
                    <div className="text-xs text-muted-foreground">+200 avaliações</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
