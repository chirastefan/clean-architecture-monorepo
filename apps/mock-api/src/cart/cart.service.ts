import { Injectable } from '@nestjs/common';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  timestamp: number;
}

export interface CartData {
  id: string;
  limit: number;
  items: CartItem[];
}

@Injectable()
export class CartService {
  private readonly cartStore = new Map<string, CartData>([
    [
      'default-planner',
      {
        id: 'default-planner',
        limit: 350,
        items: [
          {
            id: 'nest-item-1',
            name: 'Ergonomic Desk Chair',
            price: 120,
            category: 'utilities',
            timestamp: Date.now() - 3600000,
          },
        ],
      },
    ],
  ]);

  getCart(id: string): CartData {
    const existing = this.cartStore.get(id);
    if (!existing) {
      const newCart: CartData = { id, limit: 300, items: [] };
      this.cartStore.set(id, newCart);
      return newCart;
    }
    return existing;
  }

  saveCart(id: string, payload: CartData): CartData {
    this.cartStore.set(id, payload);
    return payload;
  }
}
