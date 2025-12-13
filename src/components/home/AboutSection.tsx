import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  const { data: settings } = useSiteSettings();

  return (
    <section id="about" className="py-20 bg-pizza-cream">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
                alt="Nossa pizzaria"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
              <div className="font-display text-3xl font-bold">14+</div>
              <div className="text-sm">Anos de tradição</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              {settings?.about_title || 'Sobre Nós'}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {settings?.about_description ||
                'Desde 2010, a Mom\'s Pizza traz o verdadeiro sabor italiano para sua mesa. Nossa massa é preparada diariamente com ingredientes selecionados.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-background rounded-xl">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Telefone</div>
                  <div className="font-semibold">{settings?.phone || '(11) 99999-9999'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-background rounded-xl">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Horário</div>
                  <div className="font-semibold">{settings?.working_hours || 'Seg-Dom: 18h às 23h'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-background rounded-xl sm:col-span-2">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
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
              <Button variant="hero" size="lg">
                <MessageCircle className="h-5 w-5 mr-2" />
                Fale Conosco
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
