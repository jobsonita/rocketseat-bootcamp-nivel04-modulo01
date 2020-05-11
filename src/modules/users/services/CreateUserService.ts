import { injectable, inject } from 'tsyringe'

import { hash } from 'bcryptjs'

import AppError from '@shared/errors/AppError'

import User from '../infra/typeorm/entities/User'

import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  name: string
  email: string
  password: string
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    name,
    email,
    password,
  }: IRequest): Promise<Omit<User, 'password'>> {
    const userWithSameEmailExists = await this.usersRepository.findByEmail(
      email
    )

    if (userWithSameEmailExists) {
      throw new AppError("There's another user registered with that e-mail")
    }

    const hashedPassword = await hash(password, 8)

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }
}
