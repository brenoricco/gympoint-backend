import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import Checkin from '../models/Checkin';

export default async (req, res, next) => {
  const { id } = req.params;

  const checkins = await Checkin.findAll({
    where: { student_id: id },
  });

  if (checkins) {
    const startDate = startOfWeek(new Date());
    const endDate = endOfWeek(new Date());

    // Check if the student has already reached 5 checkins in the week
    let countCheckinsWeek = 0;
    checkins.forEach(checkin => {
      const checkinDates = checkin.dataValues.createdAt;
      const verifyCheckin = isWithinInterval(checkinDates, {
        start: startDate,
        end: endDate,
      });

      if (verifyCheckin) {
        countCheckinsWeek++;

        if (countCheckinsWeek === 5) {
          return res
            .status(401)
            .json({ error: 'You have reached your weekly checkins limit' });
        }
        return next();
      }
    });
  }
};
