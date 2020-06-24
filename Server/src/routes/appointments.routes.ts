import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointmentsReposiotry = new AppointmentsRepository();

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointmentsReposiotry.findByDate(
    parsedDate,
  );

  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ error: 'Appointment is already booked' });
  }

  const appointment = appointmentsReposiotry.create(provider, parsedDate);

  return response.json(appointment);
});

appointmentsRouter.get('/', (request, response) => {
  return response.json(appointmentsReposiotry.index);
});

export default appointmentsRouter;
