import { useState } from 'react';
import { useAddresses, useDeleteAddress, useUpdateAddress, UserAddress } from '@/hooks/useAddresses';
import { AddressModal } from './AddressModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Plus, Trash2, Star, Edit2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function AddressList() {
  const { data: addresses, isLoading } = useAddresses();
  const deleteAddress = useDeleteAddress();
  const updateAddress = useUpdateAddress();
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSetDefault = async (address: UserAddress) => {
    // First, remove default from all addresses
    const defaultAddresses = addresses?.filter(a => a.is_default && a.id !== address.id) || [];
    for (const addr of defaultAddresses) {
      await updateAddress.mutateAsync({ id: addr.id, is_default: false });
    }
    // Then set this one as default
    await updateAddress.mutateAsync({ id: address.id, is_default: true });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteAddress.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Meus Endereços</h3>
        <Button onClick={() => setShowModal(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Endereço
        </Button>
      </div>

      {addresses && addresses.length > 0 ? (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card 
              key={address.id} 
              className={`relative ${address.is_default ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${address.is_default ? 'bg-primary/10' : 'bg-muted'}`}>
                    <MapPin className={`h-5 w-5 ${address.is_default ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{address.label}</span>
                      {address.is_default && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Padrão
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {address.street}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.neighborhood}, {address.city} - {address.state}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CEP: {address.cep}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!address.is_default && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleSetDefault(address)}
                        title="Definir como padrão"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(address.id)}
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Você ainda não tem endereços salvos
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Endereço
            </Button>
          </CardContent>
        </Card>
      )}

      <AddressModal
        open={showModal}
        onOpenChange={setShowModal}
        onConfirm={() => setShowModal(false)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover endereço?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O endereço será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
