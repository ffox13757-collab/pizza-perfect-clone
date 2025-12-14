import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { PizzaBuilder } from '@/components/pizza-builder/PizzaBuilder';
import { useCart } from '@/hooks/useCart';
import { PizzaSelection } from '@/types/pizza';

export default function BuildPizzaPage() {
  const { addItem } = useCart();

  const handleAddToCart = (selection: PizzaSelection, totalPrice: number) => {
    // Create a virtual product for the pizza
    const pizzaProduct = {
      id: `pizza-${Date.now()}`,
      category_id: null,
      name: `Pizza ${selection.size?.name} - ${selection.flavors.map(f => f.product.name).join(' + ')}`,
      description: `Borda: ${selection.border?.name}`,
      price: totalPrice,
      image_url: selection.flavors[0]?.product.image_url || null,
      is_vegetarian: selection.flavors.every(f => f.product.is_vegetarian),
      is_featured: false,
      is_active: true,
      display_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addItem(pizzaProduct);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Monte sua <span className="text-primary">Pizza</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Escolha o tamanho, borda e até {4} sabores diferentes para criar a pizza perfeita!
              </p>
            </div>
          </div>
        </section>

        {/* Pizza Builder */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <PizzaBuilder onAddToCart={handleAddToCart} />
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
