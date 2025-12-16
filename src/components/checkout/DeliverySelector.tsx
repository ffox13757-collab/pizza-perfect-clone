import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDeliveryZones, DeliveryZone } from '@/hooks/useDeliveryZones';
import { Truck, Store, Clock, MapPin } from 'lucide-react';

interface DeliverySelectorProps {
  orderType: 'delivery' | 'pickup';
  selectedZone: DeliveryZone | null;
  onOrderTypeChange: (type: 'delivery' | 'pickup') => void;
  onZoneChange: (zone: DeliveryZone | null) => void;
}

export const DeliverySelector = ({
  orderType,
  selectedZone,
  onOrderTypeChange,
  onZoneChange,
}: DeliverySelectorProps) => {
  const { data: zones, isLoading } = useDeliveryZones();

  const handleZoneChange = (zoneId: string) => {
    const zone = zones?.find(z => z.id === zoneId) || null;
    onZoneChange(zone);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Tipo de Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={orderType}
          onValueChange={(value) => {
            onOrderTypeChange(value as 'delivery' | 'pickup');
            if (value === 'pickup') {
              onZoneChange(null);
            }
          }}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem
              value="delivery"
              id="delivery"
              className="peer sr-only"
            />
            <Label
              htmlFor="delivery"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <Truck className="mb-2 h-6 w-6" />
              <span className="font-medium">Entrega</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="pickup"
              id="pickup"
              className="peer sr-only"
            />
            <Label
              htmlFor="pickup"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <Store className="mb-2 h-6 w-6" />
              <span className="font-medium">Retirada</span>
            </Label>
          </div>
        </RadioGroup>

        {orderType === 'delivery' && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Selecione sua região
            </Label>
            <Select
              value={selectedZone?.id || ''}
              onValueChange={handleZoneChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha a zona de entrega" />
              </SelectTrigger>
              <SelectContent>
                {zones?.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{zone.name}</span>
                      <span className="text-muted-foreground text-sm">
                        R$ {zone.delivery_fee.toFixed(2)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedZone && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Tempo estimado: {selectedZone.estimated_time_min}-{selectedZone.estimated_time_max} min
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Bairros: </span>
                  {selectedZone.neighborhoods.join(', ')}
                </div>
                <div className="text-sm font-medium text-primary">
                  Taxa de entrega: R$ {selectedZone.delivery_fee.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}

        {orderType === 'pickup' && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              Retire seu pedido em nossa loja. Sem taxa de entrega!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
