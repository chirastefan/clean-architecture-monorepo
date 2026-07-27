import { DomainError } from '../errors/DomainError';

export type Result<T, E extends DomainError = DomainError> =
  { ok: true; value: T } | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
});

export const fail = <E extends DomainError>(error: E): Result<never, E> => ({
  ok: false,
  error,
});
