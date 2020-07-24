import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/Fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '12334049',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments at the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '12334049',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '12334049',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
