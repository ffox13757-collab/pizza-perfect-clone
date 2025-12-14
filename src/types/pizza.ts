export interface PizzaSize {
  id: string;
  name: string;
  code: string;
  description: string | null;
  price_multiplier: number;
  max_flavors: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PizzaBorder {
  id: string;
  name: string;
  description: string | null;
  additional_price: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductPrice {
  id: string;
  product_id: string;
  size_id: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface PizzaSelection {
  size: PizzaSize | null;
  border: PizzaBorder | null;
  flavors: Array<{
    product: import('./database').Product;
    fraction: number; // 1 = inteira, 0.5 = meia, 0.33 = 1/3, 0.25 = 1/4
  }>;
}

export interface CartPizzaItem {
  id: string;
  type: 'pizza';
  selection: PizzaSelection;
  quantity: number;
  totalPrice: number;
}

export interface CartProductItem {
  id: string;
  type: 'product';
  product: import('./database').Product;
  quantity: number;
  totalPrice: number;
}

export type CartItemType = CartPizzaItem | CartProductItem;
