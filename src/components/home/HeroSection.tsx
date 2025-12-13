import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ArrowRight, Star, Clock, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import pizzaMargheritaImage from '@/assets/pizza-margherita.jpg';

export function HeroSection() {
  const { data: settings } = useSiteSettings();

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-warm">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-float" style={{ animationDelay: '0s' }}>🍕</div>
        <div className="absolute top-40 right-20 text-3xl animate-float" style={{ animationDelay: '1s' }}>🧀</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-float" style={{ animationDelay: '2s' }}>🍅</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🌿</div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>🔥 Delivery em até 30 min</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {settings?.hero_title || (
                <>
                  Pizza <span className="text-gradient">Artesanal</span> com Sabor de Casa
                </>
              )}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              {settings?.hero_subtitle ||
                'Feita com ingredientes frescos e muito amor. Entrega rápida para você saborear quentinha.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/menu">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Ver Cardápio
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${settings?.whatsapp || '5511999999999'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  📞 Pedir Agora
                </Button>
              </a>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold">4.9</div>
                  <div className="text-muted-foreground text-xs">+500 avaliações</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="font-bold">30 min</div>
                  <div className="text-muted-foreground text-xs">Tempo médio</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold">Grátis</div>
                  <div className="text-muted-foreground text-xs">Acima de R$50</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl scale-90 animate-pulse-slow" />
              
              {/* Main pizza image */}
              <div className="relative animate-float">
                <img
                  src={pizzaMargheritaImage}
                  alt="Pizza deliciosa"
                  className="relative w-full h-full object-cover rounded-full shadow-2xl border-4 border-background"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 bg-card shadow-xl rounded-2xl p-4 animate-bounce-in border border-border" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍕</span>
                  <div>
                    <div className="font-display font-bold">Margherita</div>
                    <div className="text-xs text-muted-foreground">Mais pedida!</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-card shadow-xl rounded-2xl p-4 animate-bounce-in border border-border" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">⭐</div>
                  <div>
                    <div className="font-display font-bold text-primary">5.0</div>
                    <div className="text-xs text-muted-foreground">Excelente!</div>
                  </div>
                </div>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 bg-accent text-accent-foreground shadow-xl rounded-full px-6 py-3 animate-bounce-in" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  <span className="font-bold text-sm">Entrega Rápida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
