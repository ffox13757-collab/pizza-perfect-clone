import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { cn } from '@/lib/utils';

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: settings } = useSiteSettings();

  const whatsappNumber = settings?.whatsapp || '5511999999999';
  const siteName = settings?.site_name || "Mom's Pizza";

  const handleWhatsApp = (message: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const quickMessages = [
    { label: '🍕 Ver Cardápio', message: 'Olá! Gostaria de ver o cardápio completo.' },
    { label: '📦 Fazer Pedido', message: 'Olá! Gostaria de fazer um pedido.' },
    { label: '🕐 Horário de Funcionamento', message: 'Olá! Qual o horário de funcionamento?' },
    { label: '📍 Endereço', message: 'Olá! Qual o endereço da pizzaria?' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Box */}
      <div
        className={cn(
          "fixed bottom-24 right-4 z-50 w-80 bg-card rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform",
          isOpen 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-[#25D366] text-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              🍕
            </div>
            <div>
              <h3 className="font-display font-bold">{siteName}</h3>
              <p className="text-sm text-white/80">Online agora</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 bg-[#ECE5DD] min-h-[120px]">
          <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%] relative">
            <p className="text-sm text-foreground">
              Olá! 👋 Como podemos ajudar você hoje?
            </p>
            <span className="text-[10px] text-muted-foreground absolute bottom-1 right-2">
              Agora
            </span>
            {/* Chat bubble arrow */}
            <div className="absolute -left-2 top-3 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-white border-b-[6px] border-b-transparent" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-3 bg-card border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Mensagens rápidas:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickMessages.map((item, index) => (
              <button
                key={index}
                onClick={() => handleWhatsApp(item.message)}
                className="text-left text-xs p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 bg-card border-t border-border">
          <button
            onClick={() => handleWhatsApp('Olá! Gostaria de mais informações.')}
            className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full py-2.5 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Iniciar Conversa
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110",
          isOpen 
            ? "bg-foreground text-background rotate-0" 
            : "bg-[#25D366] text-white animate-pulse"
        )}
        style={{
          boxShadow: isOpen 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(37, 211, 102, 0.5)'
        }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>

      {/* Pulse ring animation */}
      {!isOpen && (
        <div className="fixed bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
      )}
    </>
  );
}
