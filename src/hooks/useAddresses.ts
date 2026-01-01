import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useAddresses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-addresses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      return data as UserAddress[];
    },
    enabled: !!user,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (address: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('user_addresses')
        .insert({ ...address, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Endereço salvo!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao salvar endereço');
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UserAddress> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_addresses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Endereço atualizado!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar endereço');
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      toast.success('Endereço removido!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover endereço');
    },
  });
};

// Função para buscar endereço pelo CEP via ViaCEP
export const fetchAddressByCep = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    throw new Error('CEP inválido');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  const data = await response.json();

  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return {
    cep: data.cep,
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
  };
};
