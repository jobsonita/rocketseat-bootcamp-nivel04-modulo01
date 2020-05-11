import fs from 'fs'
import path from 'path'
import { getRepository } from 'typeorm'

import { tmpDir } from '@config/upload'

import User from '@modules/users/infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'

interface Request {
  user_id: string
  avatarFilename: string
}

export default class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne(user_id)

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

    await usersRepository.save(user)

    return user
  }
}
