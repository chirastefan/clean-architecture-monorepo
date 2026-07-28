import { CartUseCase, AddItemUseCase, UpdateLimitUseCase, RemoveItemUseCase } from '@clean/cart';

import { AsyncStorageCartRepository } from '../adapters/async-storage-cart-repository';
import { NativeAlertNotificationAdapter } from '../adapters/native-alert-notification-adapter';

const cartRepository = new AsyncStorageCartRepository();
const notificationAdapter = new NativeAlertNotificationAdapter();

const mockIdGenerator = { generateId: () => `mobile-${Date.now()}` };
const mockClock = { now: () => Date.now() };

export const mobileDependencies = {
  cartUseCase: new CartUseCase(cartRepository),
  addItemUseCase: new AddItemUseCase(
    cartRepository,
    notificationAdapter,
    mockIdGenerator,
    mockClock
  ),
  updateLimitUseCase: new UpdateLimitUseCase(cartRepository, notificationAdapter),
  removeItemUseCase: new RemoveItemUseCase(cartRepository, notificationAdapter),
};
