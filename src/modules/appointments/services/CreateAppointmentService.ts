import { startOfHour } from 'date-fns'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

import AppError from '@shared/errors/AppError'

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  date: Date
}

export default class CreateAppointmentService {
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    const bookedAppointmentInSameDateExists = await this.appointmentsRepository.findByDate(
      appointmentDate
    )

    if (bookedAppointmentInSameDateExists) {
      throw new AppError("There's another appointment booked at that time")
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    })

    return appointment
  }
}
