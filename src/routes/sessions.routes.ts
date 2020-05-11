import { Router } from 'express'

import AuthenticateUserService from '../services/AuthenticateUserService'

const router = Router()

router.post('/', async (req, res) => {
  const { email, password } = req.body

  const authenticateUser = new AuthenticateUserService()

  const { token } = await authenticateUser.execute({ email, password })

  return res.json({ token })
})

export default router
