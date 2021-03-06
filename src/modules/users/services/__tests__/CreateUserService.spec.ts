import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      email: 'user@mail.com',
      name: 'usuario fake',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('user@mail.com');
  });

  it('should not be able to create a new users with same email from another', async () => {
    await createUser.execute({
      email: 'user@mail.com',
      name: 'usuario fake',
      password: '123456',
    });

    await expect(
      createUser.execute({
        email: 'user@mail.com',
        name: 'usuario fake',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
