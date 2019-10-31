import Mail from '../../lib/Mail';

class AnswerHelpOrder {
  get key() {
    return 'AnswerHelpOrder';
  }

  async handle({ data }) {
    const { helpOrder, updatedHelpOrder } = data;

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Resposta Help Order GymPoint',
      template: 'helporders',
      context: {
        student: helpOrder.student.name,
        question: helpOrder.question,
        answer: updatedHelpOrder.answer,
      },
    });
  }
}

export default new AnswerHelpOrder();
