
import { Request, Response } from 'express';
import scheduleService from '../service/scheduleService';


class ScheduleController {



    // Salvar Regras, 1 ou mais.

    public async saveRules(req: Request, res: Response): Promise<Response> {
        let scheduleRules = req.body;
        let parseRules;
        // Faz a verificação se são 1 ou mais regras, para verificar a necessidade de criação de um vetor de regras
        // Atributo necessário em scheduleService.saveRules
        if (Array.isArray(scheduleRules)) {
            parseRules = scheduleRules;
        } else {
            parseRules = [scheduleRules];
        }
        try {
            let r = await scheduleService.saveRules(parseRules);
            if (r) {
                return res.status(201).json(r);
            }
        } catch (error) {
            res.status(401).json(error);
        }
    }

    // Deletar regra pelo id
    public async deleteScheduleRuleById(req: Request, res: Response): Promise<Response> {
        try {
            let r = await scheduleService.deleteScheduleRuleById(req.params.id);
            return res.json(r);
        } catch (error) {
            res.status(401).json(error);
        }

    }

    // Listar regras
    public async listScheduleRule(req: Request, res: Response): Promise<Response> {
        return res.send(scheduleService.listScheduleRule());
    }

    // Listar regras em um faixa de datas
    public async listScheduleRuleInRange(req: Request, res: Response): Promise<Response> {

        let startDate = req.params.startDate;
        let endDate = req.params.endDate;

        try {
            let r = scheduleService.listScheduleRuleInRange(startDate, endDate);
            return res.json(r);
        } catch (error) {
            res.status(401).json(error);
        }

        return res.json();
    }


}

export default new ScheduleController();