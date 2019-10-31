import { addMonths, parseISO } from 'date-fns';
import * as Yup from 'yup';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';
import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class RegistrationController {
  async index(req, res) {
    const { page } = req.query;

    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      order: ['end_date'],
      limit: 20, // max limit for page
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    if (!registrations) {
      return res.status(401).json({ error: 'No registration found' });
    }

    return res.json(registrations);
  }

  async store(req, res) {
    // Input data validation
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    // Verify student exists
    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'Student not exists' });
    }

    // Verify plan exists
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'Plan not exists' });
    }

    // Calculated price and end_date
    const { duration, price } = plan;

    const calculatedPrice = duration * price;

    const date = parseISO(start_date);

    const end_date = addMonths(date, duration);

    // create registration
    const registration = await Registration.create({
      start_date,
      student_id,
      plan_id,
      end_date,
      price: calculatedPrice,
    });

    // send email registration to student
    await Queue.add(RegistrationMail.key, {
      registration,
      plan,
      student,
    });

    return res.json(registration);
  }

  async update(req, res) {
    // Input data validation
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      student_id: Yup.number(),
      plan_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    // Verify registration exists

    const { id } = req.params;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(401).json({ error: 'Registration not found' });
    }

    // Verify student exists

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'Student not exists' });
    }

    // Verify plan exists
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'Plan not exists' });
    }

    // Calculated price and end_date
    const { duration, price } = plan;

    const calculatedPrice = duration * price;

    const date = parseISO(start_date);

    const end_date = addMonths(date, duration);

    // Updating registration data
    const updatedRegistration = await registration.update({
      ...req.body,
      end_date,
      price: calculatedPrice,
    });

    return res.json(updatedRegistration);
  }

  async delete(req, res) {
    // Check registration exists
    const { id } = req.params;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(401).json({ error: 'Registration not found.' });
    }

    // Delete registration
    await registration.destroy();

    return res.json();
  }
}

export default new RegistrationController();
