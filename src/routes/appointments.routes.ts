import { parseISO } from 'date-fns'
import { Router } from 'express'
import { getCustomRepository } from 'typeorm'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

import AppointmentsRepository from '../repositories/AppointmentsRepository'

import CreateAppointmentService from '../services/CreateAppointmentService'

const router = Router()

router.use(ensureAuthenticated)

router.get('/', async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)

  const appointments = await appointmentsRepository.find()

  return res.json(appointments)
})

router.post('/', async (req, res) => {
  const { provider_id, date } = req.body

  const parsedDate = parseISO(date)

  const createAppointment = new CreateAppointmentService()

  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  })

  return res.json(appointment)
})

export default router
