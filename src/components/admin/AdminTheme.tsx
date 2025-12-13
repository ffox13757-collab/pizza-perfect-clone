import { useState, useEffect } from 'react';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Palette } from 'lucide-react';
import { toast } from 'sonner';

const presetThemes = [
  {
    name: 'Pizza Clássica',
    primary: '#FF6B35',
    secondary: '#2E2E2E',
    accent: '#4ECDC4',
  },
  {
    name: 'Italiano',
    primary: '#C41E3A',
    secondary: '#228B22',
    accent: '#FFD700',
  },
  {
    name: 'Moderno',
    primary: '#E63946',
    secondary: '#1D3557',
    accent: '#A8DADC',
  },
  {
    name: 'Rústico',
    primary: '#8B4513',
    secondary: '#2F4F4F',
    accent: '#DAA520',
  },
];

export function AdminTheme() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  const [colors, setColors] = useState({
    primary_color: '#FF6B35',
    secondary_color: '#2E2E2E',
    accent_color: '#4ECDC4',
  });

  useEffect(() => {
    if (settings) {
      setColors({
        primary_color: settings.primary_color || '#FF6B35',
        secondary_color: settings.secondary_color || '#2E2E2E',
        accent_color: settings.accent_color || '#4ECDC4',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      for (const [key, value] of Object.entries(colors)) {
        await updateSetting.mutateAsync({ key, value });
      }
      toast.success('Cores salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar cores');
    }
  };

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setColors({
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
    });
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
        <h2 className="font-display text-2xl font-bold">Tema & Cores</h2>
        <Button onClick={handleSave} disabled={updateSetting.isPending}>
          {updateSetting.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar
        </Button>
      </div>

      {/* Presets */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-lg mb-4">Temas Predefinidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presetThemes.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="p-4 rounded-xl border border-border hover:border-primary transition-colors text-left"
            >
              <div className="flex gap-1 mb-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: preset.secondary }}
                />
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: preset.accent }}
                />
              </div>
              <span className="text-sm font-medium">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-lg mb-4">Cores Personalizadas</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <Label className="mb-2 block">Cor Primária</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.primary_color}
                onChange={(e) => setColors({ ...colors, primary_color: e.target.value })}
                className="w-12 h-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={colors.primary_color}
                onChange={(e) => setColors({ ...colors, primary_color: e.target.value })}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Botões, links e destaques</p>
          </div>

          <div>
            <Label className="mb-2 block">Cor Secundária</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.secondary_color}
                onChange={(e) => setColors({ ...colors, secondary_color: e.target.value })}
                className="w-12 h-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={colors.secondary_color}
                onChange={(e) => setColors({ ...colors, secondary_color: e.target.value })}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Textos e fundos secundários</p>
          </div>

          <div>
            <Label className="mb-2 block">Cor de Destaque</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.accent_color}
                onChange={(e) => setColors({ ...colors, accent_color: e.target.value })}
                className="w-12 h-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={colors.accent_color}
                onChange={(e) => setColors({ ...colors, accent_color: e.target.value })}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Badges e elementos especiais</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-lg mb-4">Prévia</h3>
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#fafafa' }}>
          <div className="flex gap-4 items-center mb-4">
            <button
              className="px-4 py-2 rounded-lg font-medium text-white"
              style={{ backgroundColor: colors.primary_color }}
            >
              Botão Primário
            </button>
            <button
              className="px-4 py-2 rounded-lg font-medium text-white"
              style={{ backgroundColor: colors.secondary_color }}
            >
              Botão Secundário
            </button>
            <span
              className="px-3 py-1 rounded-full text-sm text-white"
              style={{ backgroundColor: colors.accent_color }}
            >
              Badge
            </span>
          </div>
          <p style={{ color: colors.secondary_color }}>
            Texto de exemplo com as cores selecionadas.
          </p>
        </div>
      </div>
    </div>
  );
}
