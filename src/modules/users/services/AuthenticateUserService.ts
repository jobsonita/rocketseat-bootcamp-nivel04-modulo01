import { injectable, inject } from 'tsyringe'

import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import authConfig from '@config/auth'

import User from '@modules/users/infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: Omit<User, 'password'>
  token: string
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Incorrect credentials')
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('Incorrect credentials')
    }

    const token = sign({}, authConfig.secret, {
      subject: user.id,
      expiresIn: authConfig.tokenDuration,
    })

    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  }
}
