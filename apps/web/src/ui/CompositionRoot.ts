import { CartUseCase, AddItemUseCase, UpdateLimitUseCase, RemoveItemUseCase } from '@clean/cart';

import { ConsoleLoggerAdapter } from '@clean/logger';
import { LocalStorageCartRepository } from '../adapters/LocalStorageCartRepository';
import { ToastNotificationAdapter } from '../adapters/ToastNotificationAdapter';
import { UuidGeneratorAdapter } from '../adapters/UuidGeneratorAdapter';
import { SystemClockAdapter } from '../adapters/SystemClockAdapter';

const cartRepository = new LocalStorageCartRepository();
const notificationAdapter = new ToastNotificationAdapter();
const idGenerator = new UuidGeneratorAdapter();
const clock = new SystemClockAdapter();
const logger = new ConsoleLoggerAdapter();

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
