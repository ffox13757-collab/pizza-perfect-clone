import { ProductCard } from '@/components/products/ProductCard';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedSection() {
  const { data: products, isLoading } = useFeaturedProducts();

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando delícias...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pizza-cream to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block text-4xl mb-4 animate-bounce-in">⭐</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pizzas em Destaque
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nossas pizzas mais amadas pelos clientes. Qualidade e sabor incomparáveis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products?.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/menu">
            <Button variant="outline" size="lg" className="group rounded-full">
              Ver Cardápio Completo
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
