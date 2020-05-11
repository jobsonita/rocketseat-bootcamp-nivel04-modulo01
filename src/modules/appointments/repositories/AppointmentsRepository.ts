import { EntityRepository, Repository } from 'typeorm'

import Appointment from '../models/Appointment'

@EntityRepository(Appointment)
export default class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.findOne({ where: { date } })
  }
}
