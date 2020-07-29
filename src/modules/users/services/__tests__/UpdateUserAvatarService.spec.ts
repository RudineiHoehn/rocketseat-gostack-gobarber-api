import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar from user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@mail.com',
      name: 'usuario fake',
      password: '123456',
    });

    const avatarFileName = 'avatarFile.jpeg';
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName,
    });

    expect(user.avatar).toBe(avatarFileName);
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'undefined',
        avatarFileName: 'avatarFile.jpeg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      email: 'user@mail.com',
      name: 'usuario fake',
      password: '123456',
    });

    const avatarOldFileName = 'avatarFile.jpeg';
    const avatarNewFileName = 'avatarFile_2.jpeg';
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: avatarOldFileName,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: avatarNewFileName,
    });

    expect(deleteFile).toHaveBeenCalledWith(avatarOldFileName);

    expect(user.avatar).toBe(avatarNewFileName);
  });
});
