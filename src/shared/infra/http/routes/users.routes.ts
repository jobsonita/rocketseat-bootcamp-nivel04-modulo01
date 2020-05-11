import { Router } from 'express'
import multer from 'multer'

import uploadConfig from '../config/upload'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

import CreateUserService from '../services/CreateUserService'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'

const upload = multer(uploadConfig)

const router = Router()

router.post('/', async (req, res) => {
  const { name, email, password } = req.body

  const createUser = new CreateUserService()

  const user = await createUser.execute({
    name,
    email,
    password,
  })

  delete user.password

  return res.json(user)
})

router.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateUserAvatar = new UpdateUserAvatarService()

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    })

    delete user.password

    return res.json(user)
  }
)

export default router
