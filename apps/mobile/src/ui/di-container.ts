import { AddItemUseCase, CartUseCase, RemoveItemUseCase, UpdateLimitUseCase } from '@clean/cart';

import {
  AsyncStorageCartRepository,
  type AsyncStorageLike,
  InMemoryAsyncStorage,
} from '../adapters/async-storage-cart-repository';
import {
  type NativeAlertHandler,
  NativeAlertNotificationAdapter,
} from '../adapters/native-alert-notification-adapter';

export type MobileDependencyOptions = {
  storage?: AsyncStorageLike;
  alertHandler?: NativeAlertHandler;
  generateId?: () => string;
  now?: () => number;
};

export function createMobileDependencies(options: MobileDependencyOptions = {}) {
  const storage = options.storage ?? new InMemoryAsyncStorage();
  const alertHandler = options.alertHandler;
  const generateId =
    options.generateId ?? (() => `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
  const now = options.now ?? (() => Date.now());

  const cartRepository = new AsyncStorageCartRepository(storage);
  const notificationAdapter = new NativeAlertNotificationAdapter(alertHandler);

  return {
    cartUseCase: new CartUseCase(cartRepository),
    addItemUseCase: new AddItemUseCase(
      cartRepository,
      notificationAdapter,
      { generateId },
      { now }
    ),
    updateLimitUseCase: new UpdateLimitUseCase(cartRepository, notificationAdapter),
    removeItemUseCase: new RemoveItemUseCase(cartRepository, notificationAdapter),
  };
}

export type MobileDependencies = ReturnType<typeof createMobileDependencies>;
