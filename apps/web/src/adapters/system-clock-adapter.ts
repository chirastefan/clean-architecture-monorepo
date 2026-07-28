import { type ClockPort } from '@clean/cart';

export class SystemClockAdapter implements ClockPort {
  public now(): number {
    return Date.now();
  }
}
