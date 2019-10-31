import { Router } from 'express';

// Middlewares
import authMiddleware from './app/middlewares/auth';
import checkinMiddleware from './app/middlewares/checkin';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerHelpOrderController from './app/controllers/AnswerHelpOrderController';

// Routes
const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Students routes
routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.put('/students/:id', StudentController.update);

// Plans routes
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Registrations routes
routes.post('/registrations', RegistrationController.store);
routes.get('/registrations', RegistrationController.index);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

// Checkins routes
routes.post(
  '/students/:id/checkins',
  checkinMiddleware,
  CheckinController.store
);
routes.get('/students/:id/checkins', CheckinController.index);

// HelpOrders routes
routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.index);

// AnswerHelpOrders routes
routes.post('/help-orders/:id/answer', AnswerHelpOrderController.store);
routes.get('/help-orders/answer', AnswerHelpOrderController.index);

export default routes;
