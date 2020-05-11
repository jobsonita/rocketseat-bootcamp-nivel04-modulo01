import { compare } from 'bcryptjs'
import { getRepository } from 'typeorm'
import { sign } from 'jsonwebtoken'

import authConfig from '../config/auth'

import AppError from '../errors/AppError'

import User from '../models/User'

interface Request {
  email: string
  password: string
}

interface Response {
  user: Omit<User, 'password'>
  token: string
}

export default class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne({ where: { email } })

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
