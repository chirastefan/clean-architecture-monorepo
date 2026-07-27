// Entities & Types
export { BudgetCart, type CartItem } from './domain/entities/BudgetCart';

// Errors
export { DomainError } from './domain/errors/DomainError';
export { BudgetExceededError } from './domain/errors/BudgetExceededError';
export { InvalidBudgetLimitError } from './domain/errors/InvalidBudgetLimitError';
export { InvalidItemError } from './domain/errors/InvalidItemError';

// Result Type
export { type Result, ok, fail } from './domain/result/Result';

// Ports
export { type CartRepositoryPort } from './ports/CartRepositoryPort';
export { type NotificationPort } from './ports/NotificationPort';
export { type IdGeneratorPort } from './ports/IdGeneratorPort';
export { type ClockPort } from './ports/ClockPort';

// Use Cases
export { CartUseCase } from './domain/useCases/CartUseCase';
export { AddItemUseCase } from './domain/useCases/AddItemUseCase';
export { UpdateLimitUseCase } from './domain/useCases/UpdateLimitUseCase';
export { RemoveItemUseCase } from './domain/useCases/RemoveItemUseCase';
