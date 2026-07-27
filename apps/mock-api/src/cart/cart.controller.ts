import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { CartService, type CartData } from './cart.service';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', framework: 'NestJS', service: 'mock-api' };
  }

  @Get('api/carts/:id')
  getCart(@Param('id') id: string): CartData {
    return this.cartService.getCart(id);
  }

  @Put('api/carts/:id')
  saveCart(@Param('id') id: string, @Body() payload: CartData): CartData {
    return this.cartService.saveCart(id, payload);
  }
}
