import { useState } from 'react';
import { useAllPizzaBorders, useCreatePizzaBorder, useUpdatePizzaBorder, useDeletePizzaBorder } from '@/hooks/usePizzaOptions';
import { PizzaBorder } from '@/types/pizza';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Loader2, Circle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPizzaBorders() {
  const { data: borders, isLoading } = useAllPizzaBorders();
  const createBorder = useCreatePizzaBorder();
  const updateBorder = useUpdatePizzaBorder();
  const deleteBorder = useDeletePizzaBorder();

  const [isOpen, setIsOpen] = useState(false);
  const [editingBorder, setEditingBorder] = useState<PizzaBorder | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    additional_price: 0,
    display_order: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      additional_price: 0,
      display_order: 0,
      is_active: true,
    });
    setEditingBorder(null);
  };

  const handleEdit = (border: PizzaBorder) => {
    setEditingBorder(border);
    setFormData({
      name: border.name,
      description: border.description || '',
      additional_price: border.additional_price,
      display_order: border.display_order,
      is_active: border.is_active,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBorder) {
        await updateBorder.mutateAsync({ id: editingBorder.id, ...formData });
        toast.success('Borda atualizada!');
      } else {
        await createBorder.mutateAsync(formData);
        toast.success('Borda criada!');
      }
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta borda?')) return;
    
    try {
      await deleteBorder.mutateAsync(id);
      toast.success('Borda excluída!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir');
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Grátis';
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Bordas de Pizza</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Borda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBorder ? 'Editar Borda' : 'Nova Borda'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Catupiry"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Borda recheada com catupiry"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="additional_price">Preço Adicional (R$)</Label>
                  <Input
                    id="additional_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.additional_price}
                    onChange={(e) => setFormData({ ...formData, additional_price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Ordem de Exibição</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Ativo</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createBorder.isPending || updateBorder.isPending}>
                  {(createBorder.isPending || updateBorder.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingBorder ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {borders && borders.length > 0 ? (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Preço Adicional</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borders.map((border) => (
                <TableRow key={border.id}>
                  <TableCell className="font-medium">{border.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{border.description}</TableCell>
                  <TableCell>
                    <span className={border.additional_price === 0 ? 'text-green-600 font-medium' : 'text-primary font-medium'}>
                      {formatPrice(border.additional_price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      border.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {border.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(border)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(border.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Circle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma borda cadastrada</p>
        </div>
      )}
    </div>
  );
}
