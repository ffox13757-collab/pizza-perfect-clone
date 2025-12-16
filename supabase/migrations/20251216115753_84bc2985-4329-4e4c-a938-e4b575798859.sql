-- Create delivery zones table
CREATE TABLE public.delivery_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  neighborhoods TEXT[] NOT NULL DEFAULT '{}',
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  estimated_time_min INTEGER NOT NULL DEFAULT 30,
  estimated_time_max INTEGER NOT NULL DEFAULT 45,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read active delivery zones"
ON public.delivery_zones
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage delivery zones"
ON public.delivery_zones
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_delivery_zones_updated_at
BEFORE UPDATE ON public.delivery_zones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add delivery_zone_id and delivery_fee to orders
ALTER TABLE public.orders 
ADD COLUMN delivery_zone_id UUID REFERENCES public.delivery_zones(id),
ADD COLUMN delivery_fee NUMERIC DEFAULT 0,
ADD COLUMN order_type TEXT DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'pickup', 'dine_in'));

-- Insert default delivery zones
INSERT INTO public.delivery_zones (name, neighborhoods, delivery_fee, estimated_time_min, estimated_time_max, display_order) VALUES
('Centro', ARRAY['Centro', 'Centro Histórico'], 5.00, 20, 30, 1),
('Zona Norte', ARRAY['Zona Norte', 'Bairro Norte'], 8.00, 30, 45, 2),
('Zona Sul', ARRAY['Zona Sul', 'Bairro Sul'], 8.00, 30, 45, 3),
('Zona Leste', ARRAY['Zona Leste', 'Bairro Leste'], 10.00, 35, 50, 4),
('Zona Oeste', ARRAY['Zona Oeste', 'Bairro Oeste'], 10.00, 35, 50, 5);