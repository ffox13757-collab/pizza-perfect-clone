import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, Search } from 'lucide-react';
import { fetchAddressByCep } from '@/hooks/useAddresses';
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

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
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
              Informe seu CEP para encontrarmos a loja mais próxima e verificar a disponibilidade de entrega.
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
              <Button variant="outline" onClick={() => setStep('cep')} className="flex-1">
                Alterar CEP
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
