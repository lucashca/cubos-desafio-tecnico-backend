import { Router } from "express";
import scheduleController from "./controller/scheduleController";

const routes = Router();
routes.post('/saveRules', scheduleController.saveRules);
routes.get('/listScheduleRule', scheduleController.listScheduleRule);
routes.delete('/deleteScheduleRuleById/:id', scheduleController.deleteScheduleRuleById);
routes.get('/listScheduleRuleInRange/:startDate/:endDate', scheduleController.listScheduleRuleInRange);




export default routes;