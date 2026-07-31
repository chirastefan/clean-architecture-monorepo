import { AddItemUseCase, CartUseCase, RemoveItemUseCase, UpdateLimitUseCase } from '@clean/cart';
import { ConsoleLoggerAdapter } from '@clean/logger';

import { LocalStorageCartRepository } from '../adapters/local-storage-cart-repository';
import { ToastNotificationAdapter } from '../adapters/toast-notification-adapter';

const cartRepository = new LocalStorageCartRepository();
const notificationAdapter = new ToastNotificationAdapter();
const logger = new ConsoleLoggerAdapter();

const idGenerator = {
  generateId: () => `next-item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
};
const clock = {
  now: () => Date.now(),
};

const cartUseCase = new CartUseCase(cartRepository);
const addItemUseCase = new AddItemUseCase(
  cartRepository,
  notificationAdapter,
  idGenerator,
  clock,
  logger
);
const updateLimitUseCase = new UpdateLimitUseCase(cartRepository, notificationAdapter);
const removeItemUseCase = new RemoveItemUseCase(cartRepository, notificationAdapter);

export const dependencies = {
  notificationAdapter,
  cartUseCase,
  addItemUseCase,
  updateLimitUseCase,
  removeItemUseCase,
};

export type Dependencies = typeof dependencies;
