export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string
  ) {
    if (!email.includes('@')) {
      throw new Error('Invalid user email address.');
    }
  }
}
