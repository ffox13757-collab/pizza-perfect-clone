import { useState } from 'react';
import { useAllLoyaltyRewards, useCreateLoyaltyReward, useUpdateLoyaltyReward, useDeleteLoyaltyReward, LoyaltyReward } from '@/hooks/useLoyalty';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Trophy, Gift } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLoyalty() {
  const { data: rewards, isLoading } = useAllLoyaltyRewards();
  const createReward = useCreateLoyaltyReward();
  const updateReward = useUpdateLoyaltyReward();
  const deleteReward = useDeleteLoyaltyReward();

  const [isOpen, setIsOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<LoyaltyReward | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points_required: 100,
    reward_type: 'discount' as 'discount' | 'free_item' | 'free_pizza',
    reward_value: null as number | null,
    display_order: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      points_required: 100,
      reward_type: 'discount',
      reward_value: null,
      display_order: 0,
      is_active: true,
    });
    setEditingReward(null);
  };

  const handleEdit = (reward: LoyaltyReward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description || '',
      points_required: reward.points_required,
      reward_type: reward.reward_type as 'discount' | 'free_item' | 'free_pizza',
      reward_value: reward.reward_value,
      display_order: reward.display_order,
      is_active: reward.is_active,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingReward) {
        await updateReward.mutateAsync({ id: editingReward.id, ...formData });
        toast.success('Recompensa atualizada!');
      } else {
        await createReward.mutateAsync(formData);
        toast.success('Recompensa criada!');
      }
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta recompensa?')) return;

    try {
      await deleteReward.mutateAsync(id);
      toast.success('Recompensa excluída!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir');
    }
  };

  const getRewardTypeLabel = (type: string) => {
    switch (type) {
      case 'discount':
        return 'Desconto';
      case 'free_item':
        return 'Item Grátis';
      case 'free_pizza':
        return 'Pizza Grátis';
      default:
        return type;
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
            <Trophy className="h-6 w-6" />
            Programa de Fidelidade
          </h2>
          <p className="text-muted-foreground">Gerencie as recompensas do programa</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Recompensa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {editingReward ? 'Editar Recompensa' : 'Nova Recompensa'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Desconto de R$10"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ganhe R$10 de desconto no seu pedido"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="points_required">Pontos Necessários *</Label>
                  <Input
                    id="points_required"
                    type="number"
                    min="1"
                    value={formData.points_required}
                    onChange={(e) => setFormData({ ...formData, points_required: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reward_type">Tipo</Label>
                  <Select
                    value={formData.reward_type}
                    onValueChange={(value: 'discount' | 'free_item' | 'free_pizza') => setFormData({ ...formData, reward_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">Desconto (R$)</SelectItem>
                      <SelectItem value="free_item">Item Grátis</SelectItem>
                      <SelectItem value="free_pizza">Pizza Grátis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.reward_type === 'discount' && (
                <div>
                  <Label htmlFor="reward_value">Valor do Desconto (R$)</Label>
                  <Input
                    id="reward_value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.reward_value || ''}
                    onChange={(e) => setFormData({ ...formData, reward_value: parseFloat(e.target.value) || null })}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Ativo</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={createReward.isPending || updateReward.isPending}>
                {(createReward.isPending || updateReward.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingReward ? 'Atualizar' : 'Criar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recompensa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Pontos</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma recompensa cadastrada
                </TableCell>
              </TableRow>
            ) : (
              rewards?.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{reward.name}</p>
                      <p className="text-xs text-muted-foreground">{reward.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getRewardTypeLabel(reward.reward_type)}</TableCell>
                  <TableCell className="font-bold text-primary">{reward.points_required} pts</TableCell>
                  <TableCell>
                    {reward.reward_value ? `R$ ${reward.reward_value.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={reward.is_active ? 'default' : 'secondary'}>
                      {reward.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(reward)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(reward.id)}>
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
