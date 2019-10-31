import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { id } = req.params;

    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: id,
      },
    });

    if (!helpOrders) {
      return res.status(401).json({ error: 'No help orders for this user' });
    }

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;

    const studentExists = await Student.findByPk(id);
    if (!studentExists) {
      return res.status(401).json({ error: 'Student not found.' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question: req.body.question,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
