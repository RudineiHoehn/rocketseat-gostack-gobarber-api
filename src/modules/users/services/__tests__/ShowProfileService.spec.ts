import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@mail.com',
      name: 'usuario fake',
      password: '123456',
    });

    const showUser = await showProfileService.execute({ user_id: user.id });

    expect(showUser.name).toBe('usuario fake');
    expect(showUser.email).toBe('user@mail.com');
  });

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      showProfileService.execute({ user_id: 'non-existing' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
