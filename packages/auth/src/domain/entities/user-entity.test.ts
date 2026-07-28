import { describe, expect, it } from 'vitest';

import { UserEntity } from './user-entity';

describe('UserEntity (packages/auth)', () => {
  it('should instantiate UserEntity correctly', () => {
    const user = new UserEntity('u-1', 'alex@example.com', 'Alex');

    expect(user.id).toBe('u-1');
    expect(user.name).toBe('Alex');
  });
});
