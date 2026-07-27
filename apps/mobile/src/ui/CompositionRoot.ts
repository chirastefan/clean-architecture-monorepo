import {
  CartUseCase,
  AddItemUseCase,
  UpdateLimitUseCase,
  RemoveItemUseCase,
  type IdGeneratorPort,
  type ClockPort,
} from '@clean/cart';

import { AsyncStorageCartRepository } from '../adapters/AsyncStorageCartRepository';
import { NativeAlertNotificationAdapter } from '../adapters/NativeAlertNotificationAdapter';

const cartRepository = new AsyncStorageCartRepository();
const notificationAdapter = new NativeAlertNotificationAdapter();

const idGenerator: IdGeneratorPort = {
  generateId: () => `mobile-item-${Date.now()}`,
};

const clock: ClockPort = {
  now: () => Date.now(),
};

const cartUseCase = new CartUseCase(cartRepository);
const addItemUseCase = new AddItemUseCase(
  cartRepository,
  notificationAdapter,
  idGenerator,
  clock
);
const updateLimitUseCase = new UpdateLimitUseCase(
  cartRepository,
  notificationAdapter
);
const removeItemUseCase = new RemoveItemUseCase(
  cartRepository,
  notificationAdapter
);

export const mobileDependencies = {
  cartUseCase,
  addItemUseCase,
  updateLimitUseCase,
  removeItemUseCase,
};

export type MobileDependencies = typeof mobileDependencies;
