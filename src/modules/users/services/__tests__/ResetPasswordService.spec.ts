import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@mail.com',
      name: 'usuario fake',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    const newPassword = '123123';
    await resetPasswordService.execute({
      token,
      newPassword,
    });

    const updatedUser = await fakeUsersRepository.findByID(user.id);
    expect(generateHash).toHaveBeenCalledWith(newPassword);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.password).toBe(newPassword);
  });

  it('should be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non_existing-token',
        newPassword: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );

    await expect(
      resetPasswordService.execute({
        token,
        newPassword: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to reset the password if passed more than two (2) hours', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@mail.com',
      name: 'usuario fake',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        newPassword: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
