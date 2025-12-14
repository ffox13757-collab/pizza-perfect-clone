
-- Tabela de tamanhos de pizza
CREATE TABLE public.pizza_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  price_multiplier NUMERIC NOT NULL DEFAULT 1,
  max_flavors INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de bordas
CREATE TABLE public.pizza_borders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  additional_price NUMERIC NOT NULL DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Preços por tamanho de produto
CREATE TABLE public.product_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  size_id UUID REFERENCES public.pizza_sizes(id) ON DELETE CASCADE NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, size_id)
);

-- Enable RLS
ALTER TABLE public.pizza_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pizza_borders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;

-- Policies for pizza_sizes
CREATE POLICY "Anyone can read active pizza sizes" ON public.pizza_sizes FOR SELECT USING (true);
CREATE POLICY "Admins can manage pizza sizes" ON public.pizza_sizes FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for pizza_borders
CREATE POLICY "Anyone can read active pizza borders" ON public.pizza_borders FOR SELECT USING (true);
CREATE POLICY "Admins can manage pizza borders" ON public.pizza_borders FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for product_prices
CREATE POLICY "Anyone can read product prices" ON public.product_prices FOR SELECT USING (true);
CREATE POLICY "Admins can manage product prices" ON public.product_prices FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_pizza_sizes_updated_at BEFORE UPDATE ON public.pizza_sizes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pizza_borders_updated_at BEFORE UPDATE ON public.pizza_borders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_prices_updated_at BEFORE UPDATE ON public.product_prices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default sizes
INSERT INTO public.pizza_sizes (name, code, description, price_multiplier, max_flavors, display_order) VALUES
('Pequena', 'P', '4 fatias - ideal para 1 pessoa', 0.7, 1, 1),
('Média', 'M', '6 fatias - ideal para 2 pessoas', 0.85, 2, 2),
('Grande', 'G', '8 fatias - ideal para 3 pessoas', 1, 3, 3),
('Gigante', 'GG', '12 fatias - ideal para 4+ pessoas', 1.3, 4, 4);

-- Insert default borders
INSERT INTO public.pizza_borders (name, description, additional_price, display_order) VALUES
('Tradicional', 'Borda clássica', 0, 1),
('Catupiry', 'Borda recheada com catupiry', 8, 2),
('Cheddar', 'Borda recheada com cheddar', 8, 3),
('Chocolate', 'Borda recheada com chocolate', 10, 4);
