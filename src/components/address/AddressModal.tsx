import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchAddressByCep } from '@/hooks/useAddresses';
import { useDeliveryZones } from '@/hooks/useDeliveryZones';
import { toast } from 'sonner';

interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (address: AddressData) => void;
}

export function AddressModal({ open, onOpenChange, onConfirm }: AddressModalProps) {
  const [step, setStep] = useState<'cep' | 'details'>('cep');
  const [cep, setCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addressData, setAddressData] = useState<AddressData>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean | null>(null);
  const [matchedZone, setMatchedZone] = useState<{ name: string; fee: number; time: string } | null>(null);

  const { data: deliveryZones } = useDeliveryZones();

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const checkDeliveryZone = (neighborhood: string) => {
    if (!deliveryZones || deliveryZones.length === 0) {
      // No zones configured, allow all
      setDeliveryAvailable(true);
      setMatchedZone(null);
      return true;
    }

    const normalizedNeighborhood = neighborhood.toLowerCase().trim();
    
    for (const zone of deliveryZones) {
      const matchedNeighborhood = zone.neighborhoods.find(
        (n) => n.toLowerCase().trim() === normalizedNeighborhood
      );
      
      if (matchedNeighborhood) {
        setDeliveryAvailable(true);
        setMatchedZone({
          name: zone.name,
          fee: zone.delivery_fee,
          time: `${zone.estimated_time_min}-${zone.estimated_time_max} min`,
        });
        return true;
      }
    }

    setDeliveryAvailable(false);
    setMatchedZone(null);
    return false;
  };

  const handleCepSearch = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      toast.error('Digite um CEP válido com 8 dígitos');
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchAddressByCep(cleanCep);
      setAddressData({
        ...addressData,
        cep: data.cep,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      });
      
      // Check if we deliver to this neighborhood
      checkDeliveryZone(data.neighborhood);
      
      setStep('details');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao buscar CEP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!addressData.number) {
      toast.error('Digite o número');
      return;
    }
    onConfirm(addressData);
    onOpenChange(false);
    // Reset
    setStep('cep');
    setCep('');
    setAddressData({
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    });
    setDeliveryAvailable(null);
    setMatchedZone(null);
  };

  const handleReset = () => {
    setStep('cep');
    setDeliveryAvailable(null);
    setMatchedZone(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {step === 'cep' ? 'Onde você está?' : 'Confirme seu endereço'}
          </DialogTitle>
        </DialogHeader>

        {step === 'cep' ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Informe seu CEP para verificarmos a disponibilidade de entrega na sua região.
            </p>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(formatCep(e.target.value))}
                  maxLength={9}
                  className="text-lg"
                />
              </div>
              <Button onClick={handleCepSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Não sabe seu CEP?{' '}
              <a
                href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Consulte aqui
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Delivery availability status */}
            {deliveryAvailable === false ? (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">
                      Infelizmente ainda não entregamos na sua região 😢
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mas você pode retirar seu pedido em nossa loja!
                    </p>
                  </div>
                </div>
              </div>
            ) : deliveryAvailable === true && matchedZone ? (
              <div className="rounded-lg bg-accent/30 border border-accent p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-accent-foreground">
                      Ótimo! Entregamos na sua região! 🎉
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Zona: {matchedZone.name} • Taxa: {formatPrice(matchedZone.fee)} • Tempo: {matchedZone.time}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">{addressData.street}</p>
              <p className="text-sm text-muted-foreground">
                {addressData.neighborhood}, {addressData.city} - {addressData.state}
              </p>
              <p className="text-xs text-muted-foreground">CEP: {addressData.cep}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  placeholder="123"
                  value={addressData.number}
                  onChange={(e) => setAddressData({ ...addressData, number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  placeholder="Apto, Bloco..."
                  value={addressData.complement || ''}
                  onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Alterar CEP
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                {deliveryAvailable === false ? 'Retirar na Loja' : 'Confirmar'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
