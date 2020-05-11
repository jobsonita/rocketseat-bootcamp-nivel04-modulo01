import { Router } from 'express'

import multer from 'multer'

import uploadConfig from '@config/upload'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

import UserAvatarController from '../controllers/UserAvatarController'
import UsersController from '../controllers/UsersController'

const upload = multer(uploadConfig)

const router = Router()
const userAvatarController = new UserAvatarController()
const usersController = new UsersController()

router.post('/', usersController.create)

router.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update
)

export default router
