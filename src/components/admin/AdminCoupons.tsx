import { useState } from 'react';
import { useAllCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon, Coupon } from '@/hooks/useCoupons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AdminCoupons() {
  const { data: coupons, isLoading } = useAllCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [isOpen, setIsOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_order_value: 0,
    max_uses: null as number | null,
    max_uses_per_user: 1,
    valid_until: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_value: 0,
      max_uses: null,
      max_uses_per_user: 1,
      valid_until: '',
      is_active: true,
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value,
      max_uses: coupon.max_uses,
      max_uses_per_user: coupon.max_uses_per_user,
      valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
      is_active: coupon.is_active,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        code: formData.code.toUpperCase(),
        valid_until: formData.valid_until || null,
      };

      if (editingCoupon) {
        await updateCoupon.mutateAsync({ id: editingCoupon.id, ...data });
        toast.success('Cupom atualizado!');
      } else {
        await createCoupon.mutateAsync(data);
        toast.success('Cupom criado!');
      }
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return;

    try {
      await deleteCoupon.mutateAsync(id);
      toast.success('Cupom excluído!');
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
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Cupons de Desconto
          </h2>
          <p className="text-muted-foreground">Gerencie os cupons promocionais</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="PIZZA10"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="10% de desconto na primeira compra"
                  />
                </div>

                <div>
                  <Label htmlFor="discount_type">Tipo de Desconto</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, discount_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discount_value">Valor do Desconto *</Label>
                  <Input
                    id="discount_value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="min_order_value">Pedido Mínimo (R$)</Label>
                  <Input
                    id="min_order_value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.min_order_value}
                    onChange={(e) => setFormData({ ...formData, min_order_value: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="max_uses">Limite de Usos</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="1"
                    value={formData.max_uses || ''}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="Ilimitado"
                  />
                </div>

                <div>
                  <Label htmlFor="max_uses_per_user">Usos por Usuário</Label>
                  <Input
                    id="max_uses_per_user"
                    type="number"
                    min="1"
                    value={formData.max_uses_per_user}
                    onChange={(e) => setFormData({ ...formData, max_uses_per_user: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="valid_until">Válido Até</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>

                <div className="col-span-2 flex items-center justify-between">
                  <Label htmlFor="is_active">Ativo</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createCoupon.isPending || updateCoupon.isPending}>
                {(createCoupon.isPending || updateCoupon.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingCoupon ? 'Atualizar' : 'Criar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum cupom cadastrado
                </TableCell>
              </TableRow>
            ) : (
              coupons?.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}%`
                      : `R$ ${coupon.discount_value.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {coupon.uses_count}
                    {coupon.max_uses ? `/${coupon.max_uses}` : ''}
                  </TableCell>
                  <TableCell>
                    {coupon.valid_until
                      ? format(new Date(coupon.valid_until), 'dd/MM/yyyy', { locale: ptBR })
                      : 'Sem limite'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                      {coupon.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
