import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Phone, MapPin, Clock, MessageCircle, ChefHat, Award, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  const { data: settings } = useSiteSettings();

  const features = [
    { icon: ChefHat, title: 'Receita Artesanal', description: 'Massa feita diariamente' },
    { icon: Award, title: 'Ingredientes Premium', description: 'Selecionados com cuidado' },
    { icon: Heart, title: 'Feito com Amor', description: 'Tradição de família' },
  ];

  return (
    <section id="about" className="py-20 bg-pizza-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 text-6xl opacity-10 animate-float">🍕</div>
      <div className="absolute bottom-10 left-10 text-6xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🧀</div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative animate-fade-in">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
                alt="Nossa pizzaria"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl animate-bounce-in">
              <div className="font-display text-4xl font-bold">14+</div>
              <div className="text-sm opacity-90">Anos de tradição</div>
            </div>

            {/* Second floating badge */}
            <div className="absolute -top-4 -left-4 bg-card text-foreground p-4 rounded-2xl shadow-xl border border-border animate-bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👨‍🍳</span>
                <div>
                  <div className="font-bold text-sm">Chef Italiano</div>
                  <div className="text-xs text-muted-foreground">Autêntico</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="animate-slide-up">
            <span className="inline-block text-4xl mb-4">🇮🇹</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              {settings?.about_title || 'Sobre Nós'}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {settings?.about_description ||
                'Desde 2010, a Mom\'s Pizza traz o verdadeiro sabor italiano para sua mesa. Nossa massa é preparada diariamente com ingredientes selecionados e muito amor.'}
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-semibold text-sm">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-background rounded-xl hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Telefone</div>
                  <div className="font-semibold">{settings?.phone || '(11) 99999-9999'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-background rounded-xl hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Horário</div>
                  <div className="font-semibold">{settings?.working_hours || 'Seg-Dom: 18h às 23h'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-background rounded-xl sm:col-span-2 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Endereço</div>
                  <div className="font-semibold">{settings?.address || 'Rua das Pizzas, 123 - Centro'}</div>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${settings?.whatsapp || '5511999999999'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero" size="lg" className="group">
                <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Fale Conosco
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
