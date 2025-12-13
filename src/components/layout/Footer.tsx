import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  const { data: settings } = useSiteSettings();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍕</span>
              <span className="font-display text-2xl font-bold">
                {settings?.site_name || "Mom's Pizza"}
              </span>
            </div>
            <p className="text-background/70 leading-relaxed max-w-md">
              {settings?.about_description ||
                'Desde 2010, trazemos o verdadeiro sabor italiano para sua mesa. Nossa massa é preparada diariamente com ingredientes selecionados.'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-background/70">
                <Phone className="h-4 w-4" />
                <span>{settings?.phone || '(11) 99999-9999'}</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <MapPin className="h-4 w-4" />
                <span>{settings?.address || 'Rua das Pizzas, 123'}</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <Clock className="h-4 w-4" />
                <span>{settings?.working_hours || 'Seg-Dom: 18h às 23h'}</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center text-background/50 text-sm">
          © {new Date().getFullYear()} {settings?.site_name || "Mom's Pizza"}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
