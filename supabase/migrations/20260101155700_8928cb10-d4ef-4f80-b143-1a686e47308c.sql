-- Tabela de endereços do usuário
CREATE TABLE public.user_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  label TEXT NOT NULL DEFAULT 'Casa',
  cep TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'PR',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de cupons
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' ou 'fixed'
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_order_value NUMERIC DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  max_uses_per_user INTEGER DEFAULT 1,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Uso de cupons por usuário
CREATE TABLE public.coupon_uses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de pontos de fidelidade
CREATE TABLE public.loyalty_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  orders_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Histórico de transações de pontos
CREATE TABLE public.loyalty_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'earned', 'redeemed', 'expired'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recompensas disponíveis
CREATE TABLE public.loyalty_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  reward_type TEXT NOT NULL DEFAULT 'discount', -- 'discount', 'free_item', 'free_pizza'
  reward_value NUMERIC,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_addresses
CREATE POLICY "Users can manage own addresses" ON public.user_addresses
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses" ON public.user_addresses
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for coupons
CREATE POLICY "Anyone can read active coupons" ON public.coupons
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage coupons" ON public.coupons
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for coupon_uses
CREATE POLICY "Users can view own coupon uses" ON public.coupon_uses
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own coupon uses" ON public.coupon_uses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage coupon uses" ON public.coupon_uses
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for loyalty_points
CREATE POLICY "Users can view own loyalty points" ON public.loyalty_points
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own loyalty points" ON public.loyalty_points
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all loyalty points" ON public.loyalty_points
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for loyalty_transactions
CREATE POLICY "Users can view own transactions" ON public.loyalty_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all transactions" ON public.loyalty_transactions
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for loyalty_rewards
CREATE POLICY "Anyone can view active rewards" ON public.loyalty_rewards
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage rewards" ON public.loyalty_rewards
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_user_addresses_updated_at
BEFORE UPDATE ON public.user_addresses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loyalty_points_updated_at
BEFORE UPDATE ON public.loyalty_points
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loyalty_rewards_updated_at
BEFORE UPDATE ON public.loyalty_rewards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices
CREATE INDEX idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupon_uses_user_id ON public.coupon_uses(user_id);
CREATE INDEX idx_loyalty_points_user_id ON public.loyalty_points(user_id);
CREATE INDEX idx_loyalty_transactions_user_id ON public.loyalty_transactions(user_id);

-- Dados iniciais de recompensas
INSERT INTO public.loyalty_rewards (name, description, points_required, reward_type, reward_value, display_order) VALUES
('Desconto de R$10', 'Ganhe R$10 de desconto no seu pedido', 100, 'discount', 10, 1),
('Refrigerante Grátis', 'Ganhe um refrigerante 2L grátis', 150, 'free_item', null, 2),
('Pizza Grátis', 'Ganhe uma pizza média de qualquer sabor', 500, 'free_pizza', null, 3),
('Borda Recheada Grátis', 'Ganhe borda recheada grátis', 75, 'free_item', null, 4);