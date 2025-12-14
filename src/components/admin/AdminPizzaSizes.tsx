import { useState } from 'react';
import { useAllPizzaSizes, useCreatePizzaSize, useUpdatePizzaSize, useDeletePizzaSize } from '@/hooks/usePizzaOptions';
import { PizzaSize } from '@/types/pizza';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Loader2, Pizza } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPizzaSizes() {
  const { data: sizes, isLoading } = useAllPizzaSizes();
  const createSize = useCreatePizzaSize();
  const updateSize = useUpdatePizzaSize();
  const deleteSize = useDeletePizzaSize();

  const [isOpen, setIsOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<PizzaSize | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    price_multiplier: 1,
    max_flavors: 1,
    display_order: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      price_multiplier: 1,
      max_flavors: 1,
      display_order: 0,
      is_active: true,
    });
    setEditingSize(null);
  };

  const handleEdit = (size: PizzaSize) => {
    setEditingSize(size);
    setFormData({
      name: size.name,
      code: size.code,
      description: size.description || '',
      price_multiplier: size.price_multiplier,
      max_flavors: size.max_flavors,
      display_order: size.display_order,
      is_active: size.is_active,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSize) {
        await updateSize.mutateAsync({ id: editingSize.id, ...formData });
        toast.success('Tamanho atualizado!');
      } else {
        await createSize.mutateAsync(formData);
        toast.success('Tamanho criado!');
      }
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tamanho?')) return;
    
    try {
      await deleteSize.mutateAsync(id);
      toast.success('Tamanho excluído!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir');
    }
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
        <h2 className="text-2xl font-bold text-foreground">Tamanhos de Pizza</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Tamanho
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSize ? 'Editar Tamanho' : 'Novo Tamanho'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Grande"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="G"
                    required
                    maxLength={3}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="8 fatias - ideal para 3 pessoas"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_multiplier">Multiplicador de Preço</Label>
                  <Input
                    id="price_multiplier"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_multiplier}
                    onChange={(e) => setFormData({ ...formData, price_multiplier: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_flavors">Máx. Sabores</Label>
                  <Input
                    id="max_flavors"
                    type="number"
                    min="1"
                    max="8"
                    value={formData.max_flavors}
                    onChange={(e) => setFormData({ ...formData, max_flavors: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Ordem</Label>
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
                <Button type="submit" disabled={createSize.isPending || updateSize.isPending}>
                  {(createSize.isPending || updateSize.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingSize ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sizes && sizes.length > 0 ? (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Multiplicador</TableHead>
                <TableHead>Máx. Sabores</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizes.map((size) => (
                <TableRow key={size.id}>
                  <TableCell>
                    <span className="font-bold text-primary text-lg">{size.code}</span>
                  </TableCell>
                  <TableCell className="font-medium">{size.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{size.description}</TableCell>
                  <TableCell>{size.price_multiplier}x</TableCell>
                  <TableCell>{size.max_flavors}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      size.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {size.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(size)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(size.id)}>
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
          <Pizza className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum tamanho cadastrado</p>
        </div>
      )}
    </div>
  );
}
