import { hash } from 'bcryptjs'

import User from '@modules/users/infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  name: string
  email: string
  password: string
}

type IResponse = Omit<User, 'password'>

export default class CreateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({
    name,
    email,
    password,
  }: IRequest): Promise<IResponse> {
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
