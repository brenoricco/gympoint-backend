import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration, student, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula concluida GymPoint',
      template: 'registration',
      context: {
        student: student.name,
        title: plan.title,
        price: registration.price,
        start_date: format(
          parseISO(registration.start_date),
          "'dia' d 'de' MMMM' de 'yyyy'",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(registration.end_date),
          "'dia' d 'de' MMMM' de 'yyyy'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new RegistrationMail();
