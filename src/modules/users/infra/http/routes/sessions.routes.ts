import { Router } from 'express'
import { container } from 'tsyringe'

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'

const router = Router()

router.post('/', async (req, res) => {
  const { email, password } = req.body

  const authenticateUser = container.resolve(AuthenticateUserService)

  const { user, token } = await authenticateUser.execute({ email, password })

  return res.json({ user, token })
})

export default router
