export type CartItemDTO = {
  id: string;
  name: string;
  price: number;
  category: string;
  timestamp: number;
};

export type CartDTO = {
  id: string;
  limit: number;
  items: CartItemDTO[];
};
