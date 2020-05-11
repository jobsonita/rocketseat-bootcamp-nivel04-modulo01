import { injectable, inject } from 'tsyringe'

import fs from 'fs'
import path from 'path'

import { tmpDir } from '@config/upload'

import User from '@modules/users/infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'

import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  user_id: string
  avatarFilename: string
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IRequest): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('Invalid user', 401)
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(tmpDir, user.avatar)
      const userAvatarExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }

    user.avatar = avatarFilename

    await this.usersRepository.save(user)

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }
}
