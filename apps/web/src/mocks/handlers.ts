import { http, HttpResponse } from 'msw';
import { CartDTO } from '../adapters/dtos/CartDTO';

// In-memory mock database for MSW
const mockCartDb = new Map<string, CartDTO>([
  [
    'msw-cart-1',
    {
      id: 'msw-cart-1',
      limit: 450,
      items: [
        {
          id: 'msw-item-1',
          name: 'Wireless Ergonomic Mouse',
          price: 65,
          category: 'utilities',
          timestamp: 1700000000000,
        },
      ],
    },
  ],
]);

export const handlers = [
  // GET /api/carts/:id
  http.get('https://api.budgetplanner.internal/api/carts/:id', ({ params }) => {
    const { id } = params;
    const cartId = String(id);
    const cart = mockCartDb.get(cartId);

    if (!cart) {
      return HttpResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    return HttpResponse.json(cart, { status: 200 });
  }),

  // PUT /api/carts/:id
  http.put('https://api.budgetplanner.internal/api/carts/:id', async ({ request, params }) => {
    const { id } = params;
    const cartId = String(id);
    const updatedDto = (await request.json()) as CartDTO;

    mockCartDb.set(cartId, updatedDto);
    return HttpResponse.json(updatedDto, { status: 200 });
  }),
];
