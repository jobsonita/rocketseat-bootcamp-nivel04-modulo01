import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeHashProvider = new FakeHashProvider()
    const fakeUsersRepository = new FakeUsersRepository()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )

    const user = await createUser.execute({
      name: 'Gobarber User',
      email: 'user@gobarber.com',
      password: '123456',
    })

    const response = await authenticateUser.execute({
      email: 'user@gobarber.com',
      password: '123456',
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })
})
