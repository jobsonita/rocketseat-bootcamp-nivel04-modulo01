import { parseISO } from 'date-fns'
import { Router } from 'express'

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const router = Router()
const appointmentsRepository = new AppointmentsRepository()

router.use(ensureAuthenticated)

// router.get('/', async (req, res) => {
//   const appointments = await appointmentsRepository.find()

//   return res.json(appointments)
// })

router.post('/', async (req, res) => {
  const { provider_id, date } = req.body

  const parsedDate = parseISO(date)

  const createAppointment = new CreateAppointmentService(appointmentsRepository)

  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  })

  return res.json(appointment)
})

export default router
