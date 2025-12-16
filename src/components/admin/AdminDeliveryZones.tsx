import { useState } from 'react';
import { useAllDeliveryZones, useCreateDeliveryZone, useUpdateDeliveryZone, useDeleteDeliveryZone, DeliveryZone } from '@/hooks/useDeliveryZones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, MapPin, Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export const AdminDeliveryZones = () => {
  const { data: zones, isLoading } = useAllDeliveryZones();
  const createZone = useCreateDeliveryZone();
  const updateZone = useUpdateDeliveryZone();
  const deleteZone = useDeleteDeliveryZone();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    neighborhoods: '',
    delivery_fee: 0,
    estimated_time_min: 30,
    estimated_time_max: 45,
    is_active: true,
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      neighborhoods: '',
      delivery_fee: 0,
      estimated_time_min: 30,
      estimated_time_max: 45,
      is_active: true,
      display_order: 0,
    });
    setEditingZone(null);
  };

  const handleEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      neighborhoods: zone.neighborhoods.join(', '),
      delivery_fee: zone.delivery_fee,
      estimated_time_min: zone.estimated_time_min,
      estimated_time_max: zone.estimated_time_max,
      is_active: zone.is_active,
      display_order: zone.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const neighborhoodsArray = formData.neighborhoods
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    const zoneData = {
      name: formData.name,
      neighborhoods: neighborhoodsArray,
      delivery_fee: formData.delivery_fee,
      estimated_time_min: formData.estimated_time_min,
      estimated_time_max: formData.estimated_time_max,
      is_active: formData.is_active,
      display_order: formData.display_order,
    };

    if (editingZone) {
      await updateZone.mutateAsync({ id: editingZone.id, ...zoneData });
    } else {
      await createZone.mutateAsync(zoneData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta zona de entrega?')) {
      await deleteZone.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Zonas de Entrega
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Zona
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingZone ? 'Editar Zona de Entrega' : 'Nova Zona de Entrega'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Zona</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Centro"
                  required
                />
              </div>

              <div>
                <Label htmlFor="neighborhoods">Bairros (separados por vírgula)</Label>
                <Textarea
                  id="neighborhoods"
                  value={formData.neighborhoods}
                  onChange={(e) => setFormData({ ...formData, neighborhoods: e.target.value })}
                  placeholder="Centro, Centro Histórico, Praça Central"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="delivery_fee">Taxa de Entrega (R$)</Label>
                <Input
                  id="delivery_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.delivery_fee}
                  onChange={(e) => setFormData({ ...formData, delivery_fee: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimated_time_min">Tempo Mín (min)</Label>
                  <Input
                    id="estimated_time_min"
                    type="number"
                    min="1"
                    value={formData.estimated_time_min}
                    onChange={(e) => setFormData({ ...formData, estimated_time_min: parseInt(e.target.value) || 30 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estimated_time_max">Tempo Máx (min)</Label>
                  <Input
                    id="estimated_time_max"
                    type="number"
                    min="1"
                    value={formData.estimated_time_max}
                    onChange={(e) => setFormData({ ...formData, estimated_time_max: parseInt(e.target.value) || 45 })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Zona Ativa</Label>
              </div>

              <Button type="submit" className="w-full" disabled={createZone.isPending || updateZone.isPending}>
                {editingZone ? 'Atualizar' : 'Criar'} Zona
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Bairros</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones?.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {zone.neighborhoods.join(', ')}
                  </TableCell>
                  <TableCell>R$ {zone.delivery_fee.toFixed(2)}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {zone.estimated_time_min}-{zone.estimated_time_max} min
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      zone.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {zone.is_active ? 'Ativa' : 'Inativa'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(zone)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(zone.id)}
                        disabled={deleteZone.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!zones || zones.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhuma zona de entrega cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
