import { Router } from 'express';

import unsureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentoRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentoRouter.use(unsureAuthenticated);

appointmentoRouter.post('/', appointmentsController.create);

export default appointmentoRouter;
