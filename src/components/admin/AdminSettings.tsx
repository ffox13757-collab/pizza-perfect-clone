import { useState, useEffect } from 'react';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  
  const [formData, setFormData] = useState({
    site_name: '',
    site_tagline: '',
    hero_title: '',
    hero_subtitle: '',
    about_title: '',
    about_description: '',
    phone: '',
    address: '',
    working_hours: '',
    whatsapp: '',
    logo_url: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || '',
        site_tagline: settings.site_tagline || '',
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        about_title: settings.about_title || '',
        about_description: settings.about_description || '',
        phone: settings.phone || '',
        address: settings.address || '',
        working_hours: settings.working_hours || '',
        whatsapp: settings.whatsapp || '',
        logo_url: settings.logo_url || '',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      for (const [key, value] of Object.entries(formData)) {
        await updateSetting.mutateAsync({ key, value });
      }
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Configurações do Site</h2>
        <Button onClick={handleSave} disabled={updateSetting.isPending}>
          {updateSetting.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Informações Básicas */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">Informações Básicas</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="site_name">Nome do Site</Label>
              <Input
                id="site_name"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="Mom's Pizza"
              />
            </div>
            <div>
              <Label htmlFor="site_tagline">Slogan</Label>
              <Input
                id="site_tagline"
                value={formData.site_tagline}
                onChange={(e) => setFormData({ ...formData, site_tagline: e.target.value })}
                placeholder="A Melhor Pizza da Cidade"
              />
            </div>
            <div>
              <Label htmlFor="logo_url">URL do Logo</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">Seção Hero (Principal)</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="hero_title">Título Principal</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Subtítulo</Label>
              <Textarea
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Sobre */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">Seção Sobre</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="about_title">Título</Label>
              <Input
                id="about_title"
                value={formData.about_title}
                onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="about_description">Descrição</Label>
              <Textarea
                id="about_description"
                value={formData.about_description}
                onChange={(e) => setFormData({ ...formData, about_description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">Contato</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp (apenas números)</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="5511999999999"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="working_hours">Horário de Funcionamento</Label>
              <Input
                id="working_hours"
                value={formData.working_hours}
                onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                placeholder="Seg-Dom: 18h às 23h"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
