-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  requires_change BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active payment methods"
ON public.payment_methods
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage payment methods"
ON public.payment_methods
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add payment_method column to orders table
ALTER TABLE public.orders ADD COLUMN payment_method TEXT;
ALTER TABLE public.orders ADD COLUMN change_for NUMERIC;

-- Insert default payment methods
INSERT INTO public.payment_methods (name, code, description, icon, requires_change, display_order) VALUES
('Dinheiro', 'cash', 'Pagamento em dinheiro na entrega', 'Banknote', true, 1),
('Pix', 'pix', 'Pagamento via Pix', 'QrCode', false, 2),
('Cartão de Crédito', 'credit_card', 'Cartão de crédito na entrega', 'CreditCard', false, 3),
('Cartão de Débito', 'debit_card', 'Cartão de débito na entrega', 'CreditCard', false, 4),
('Vale Refeição', 'meal_voucher', 'Alelo, Sodexo, VR, etc.', 'Ticket', false, 5);