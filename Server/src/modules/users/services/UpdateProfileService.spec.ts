import AppError from '@shared/errors/AppError';
import FakeHashprovider from '../providers/hashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashprovider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashprovider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Luan Coleto',
      email: 'luancoleto@outlook.com',
    });

    expect(updatedUser.name).toBe('Luan Coleto');
    expect(updatedUser.email).toBe('luancoleto@outlook.com');
  });

  it('should not be able to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Luan',
      email: 'luancoleto@outlook.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateProfile.execute({
      user_id: user.id,
      name: 'Luan Coleto',
      email: 'luancoleto@outlook.com',
      old_password: '123456',
      password: '2482',
    });

    expect(user.password).toBe('2482');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Luan Coleto',
        email: 'luancoleto@outlook.com',
        password: '2482',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Luan Coleto',
        email: 'luancoleto@outlook.com',
        old_password: 'wrong-old-password',
        password: '2482',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-id',
        name: 'Luan Coleto',
        email: 'luancoleto@outlook.com',
        old_password: 'wrong-old-password',
        password: '2482',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
