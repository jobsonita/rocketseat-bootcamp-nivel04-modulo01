import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository'

import AppError from '@shared/errors/AppError'

interface Request {
  provider_id: string
  date: Date
}

export default class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)

    const appointmentDate = startOfHour(date)

    const bookedAppointmentInSameDateExists = await appointmentsRepository.findByDate(
      appointmentDate
    )

    if (bookedAppointmentInSameDateExists) {
      throw new AppError("There's another appointment booked at that time")
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    })

    await appointmentsRepository.save(appointment)

    return appointment
  }
}
