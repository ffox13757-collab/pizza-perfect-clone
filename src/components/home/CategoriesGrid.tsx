import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { Pizza, Coffee, IceCream, Salad, UtensilsCrossed } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  pizza: <Pizza className="h-8 w-8" />,
  pizzas: <Pizza className="h-8 w-8" />,
  bebidas: <Coffee className="h-8 w-8" />,
  drinks: <Coffee className="h-8 w-8" />,
  sobremesas: <IceCream className="h-8 w-8" />,
  desserts: <IceCream className="h-8 w-8" />,
  saladas: <Salad className="h-8 w-8" />,
  salads: <Salad className="h-8 w-8" />,
};

const defaultImages: Record<string, string> = {
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
  pizzas: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
  bebidas: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  sobremesas: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
  desserts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
};

export function CategoriesGrid() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">Nosso Cardápio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl font-bold mb-6 text-center">Nosso Cardápio</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const lowerName = category.name.toLowerCase();
            const icon = categoryIcons[lowerName] || <UtensilsCrossed className="h-8 w-8" />;
            const image = category.image_url || defaultImages[lowerName] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop';
            
            return (
              <Link 
                key={category.id} 
                to={`/menu?category=${category.id}`}
                className="group"
              >
                <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden bg-card shadow-sm border border-border/50 hover:shadow-lg transition-all hover:-translate-y-1">
                  <img
                    src={image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="p-3 rounded-full bg-primary/80 backdrop-blur-sm mb-2 group-hover:scale-110 transition-transform">
                      {icon}
                    </div>
                    <h3 className="font-display text-lg font-bold text-center px-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-white/70 mt-1 text-center px-4 line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
