import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import AnswerHelpOrder from '../jobs/AnswerHelpOrder';

class AnswerHelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
    });

    if (!helpOrders) {
      return res
        .status(401)
        .json({ error: 'No help orders loading to answer.' });
    }

    return res.json(helpOrders);
  }

  async store(req, res) {
    // Input data validation
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    // Check HelpOrder exists
    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(401).json({ error: 'Help order not found.' });
    }
    // Check if HelpOrder has already been answered
    const { answer } = helpOrder;

    if (answer !== null) {
      return res.status(401).json({ error: 'You alredy answer this question' });
    }

    const updatedHelpOrder = await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    // send email registration to student
    await Queue.add(AnswerHelpOrder.key, {
      helpOrder,
      updatedHelpOrder,
    });

    return res.json(updatedHelpOrder);
  }
}

export default new AnswerHelpOrderController();
