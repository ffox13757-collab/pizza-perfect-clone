import { useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Pizza, 
  FolderOpen, 
  ShoppingBag, 
  Palette, 
  Loader2,
  LayoutDashboard,
  ArrowLeft,
  Ruler,
  Circle,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminCategories } from '@/components/admin/AdminCategories';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminTheme } from '@/components/admin/AdminTheme';
import { AdminPizzaSizes } from '@/components/admin/AdminPizzaSizes';
import { AdminPizzaBorders } from '@/components/admin/AdminPizzaBorders';
import { AdminPaymentMethods } from '@/components/admin/AdminPaymentMethods';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/settings', label: 'Configurações', icon: Settings },
  { path: '/admin/products', label: 'Produtos', icon: Pizza },
  { path: '/admin/categories', label: 'Categorias', icon: FolderOpen },
  { path: '/admin/sizes', label: 'Tamanhos', icon: Ruler },
  { path: '/admin/borders', label: 'Bordas', icon: Circle },
  { path: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
  { path: '/admin/payments', label: 'Pagamentos', icon: CreditCard },
  { path: '/admin/theme', label: 'Tema & Cores', icon: Palette },
];

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Bem-vindo ao Painel Admin</h2>
      <p className="text-muted-foreground">
        Use o menu lateral para gerenciar seu restaurante.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.slice(1).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-all border border-border hover:border-primary/50"
          >
            <item.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-display font-semibold text-lg">{item.label}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para acessar esta página.
          </p>
          <Link to="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-4 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🍕</span>
          <span className="font-display text-xl font-bold">Admin</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Site
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border p-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍕</span>
            <span className="font-display font-bold">Admin</span>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <nav className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 pt-32 lg:pt-6">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/sizes" element={<AdminPizzaSizes />} />
            <Route path="/borders" element={<AdminPizzaBorders />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/payments" element={<AdminPaymentMethods />} />
            <Route path="/theme" element={<AdminTheme />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
