"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserTokensRepository"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/hashProvider/fakes/FakeHashProvider"));

var _ResetPasswordService = _interopRequireDefault(require("./ResetPasswordService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeUserTokensRepository;
let fakeHashProvider;
let resetPassword;
describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeUserTokensRepository = new _FakeUserTokensRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    resetPassword = new _ResetPasswordService.default(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider);
  });
  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const {
      token
    } = await fakeUserTokensRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    await resetPassword.execute({
      password: '123454',
      token
    });
    const updatedUser = await fakeUsersRepository.findById(user.id);
    expect(generateHash).toHaveBeenCalledWith('123454');
    expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.password).toBe('123454');
  });
  it('should not be able to reset the password without an existing token', async () => {
    await expect(resetPassword.execute({
      token: 'no-existing-token',
      password: '2333'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset the password without an existing user', async () => {
    const {
      token
    } = await fakeUserTokensRepository.generate('non-existing-user');
    await expect(resetPassword.execute({
      token,
      password: '2333'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const {
      token
    } = await fakeUserTokensRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });
    await expect(resetPassword.execute({
      password: '123454',
      token
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});