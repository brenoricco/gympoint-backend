import Registration from '../models/Registration';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
    });

    if (!checkins) {
      return res.status(401).json({ error: 'No checkin for this user' });
    }

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;
    // Check student exists
    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(401).json({ error: 'Student not found.' });
    }

    // Check registration exists
    const registration = await Registration.findOne({
      where: { student_id: id },
    });

    if (!registration) {
      return res.status(401).json({ error: 'Student is not registration' });
    }

    const newCheckin = await Checkin.create({
      student_id: id,
    });

    return res.json(newCheckin);
  }
}

export default new CheckinController();
