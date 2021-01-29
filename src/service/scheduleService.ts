
import scheduleDao from '../dao/scheduleDao';
import Schedule from '../model/schedule';
import { ScheduleRuleType } from '../utils/enums';
import { ApplicationError } from '../utils/error';
import { validateDate, validateDaysInWeek, validateIntervals, validateIntervalUnion } from '../utils/validator';


class ScheduleService {


    public saveRules(scheduleRules: Array<Schedule>): Schedule[] {

        let dbRules = this.listScheduleRule();
        let rules = [];
        for (let r of scheduleRules) {
            // Valida cada intervalo
            // Se houver alguma falha será disparada uma exceção e a função será finalizada 
            validateIntervals(r);
            let rule;
            switch (r.type) {
                case ScheduleRuleType.DAILY:
                    rule = new Schedule(ScheduleRuleType.DAILY, r.intervals, null, null);
                    this.checkSimilarRules(dbRules, rule, ScheduleRuleType.DAILY);
                    rules.push(rule);
                    break;
                case ScheduleRuleType.SPECIFIC_DATE:
                    // Valida o atributo day
                    // Se houver alguma falha será disparada uma exceção e a função será finalizada 
                    validateDate(r.day, r);
                    rule = new Schedule(ScheduleRuleType.SPECIFIC_DATE, r.intervals, r.day, null);
                    this.checkSimilarRules(dbRules, rule, ScheduleRuleType.SPECIFIC_DATE);
                    rules.push(rule);
                    break;
                case ScheduleRuleType.WEEKLY:
                    // Valida o atributo daysOfWeek
                    // Se houver alguma falha será disparada uma exceção e a função será finalizada 
                    r = validateDaysInWeek(r);
                    rule = new Schedule(ScheduleRuleType.WEEKLY, r.intervals, null, r.daysInWeek);
                    this.checkSimilarRules(dbRules, rule, ScheduleRuleType.WEEKLY);
                    rules.push(rule);
                    break;
                default:
                    // Caso o atributo seja diferente dos conhecidos dispara uma exceção
                    throw ApplicationError.newErrorNoTypeFound(r.type, r);
            }
        }
        scheduleDao.saveSchedules(rules);
        return rules;
    }


    private checkSimilarRules(dbRules: Schedule[], rule: Schedule, type) {
        // Verifica se a regra a ser cadastrada se choca com algum intervalo já existente no banco de dados.
        if (dbRules && dbRules.length > 0) {
            for (let r of dbRules) {
                switch (type) {
                    case ScheduleRuleType.DAILY:
                        if (r.type == ScheduleRuleType.DAILY || r.type == ScheduleRuleType.WEEKLY) {
                            // Verifica se a regra que irá ser cadastradas possui uma união vazia com os intervalos semanais e diarios.
                            // Não verifico com as regras de data especifica, pois as enxergo como regras especias no sistema que só serão comparadas entre-si.
                            let intervals = r.intervals;
                            intervals = intervals.concat(rule.intervals);
                            // Verifica se este intervalo se choca com algum outro do banco de dados.
                            validateIntervalUnion({ intervals }, true);
                        }
                        break;
                    case ScheduleRuleType.WEEKLY:
                        // Verifica se a regra que irá ser cadastradas possui uma união vazia com os intervalos semanais e diarios.
                        // Não verifico com as regras de data especifica, pois as enxergo como regras especias no sistema que só serão comparadas entre-si.

                        // Verifico com todas os intervalos diarios
                        if (r.type == ScheduleRuleType.DAILY) {
                            let intervals = r.intervals;
                            // Concatena o itervalo da regra a ser cadastrada, com o itervalo da regra cadastrada e depois verifica se os intervalos se chocam.
                            intervals = intervals.concat(rule.intervals);
                            validateIntervalUnion({ intervals }, true);
                        }

                        // Verifico apenas com os intervalos com mesmos dias da semana
                        if (r.type == ScheduleRuleType.WEEKLY) {
                            for (let d of r.daysInWeek) {
                                if (rule.daysInWeek.includes(d)) {
                                    let intervals = r.intervals;
                                    // Concatena o itervalo da regra a ser cadastrada, com o itervalo da regra cadastrada e depois verifica se os intervalos se chocam.
                                    intervals = intervals.concat(rule.intervals);
                                    validateIntervalUnion({ intervals }, true);
                                }
                            }
                        }
                        break;
                    case ScheduleRuleType.SPECIFIC_DATE:
                        // Como entendo que esta regra possua uma característica especial ela só é comparada entre si.
                        if (r.type == ScheduleRuleType.SPECIFIC_DATE) {
                            if (r.day == rule.day) {
                                let intervals = r.intervals;
                                // Concatena o itervalo da regra a ser cadastrada, com o itervalo da regra cadastrada e depois verifica se os intervalos se chocam.
                                intervals = intervals.concat(rule.intervals);
                                validateIntervalUnion({ intervals }, true);
                            }
                        }
                        break;
                }

            }

        }

    }


    public deleteScheduleRuleById(id): Boolean {
        let r = scheduleDao.deleteScheduleRuleById(id);
        return r;
    }

    public listScheduleRule(): Schedule[] {
        return scheduleDao.listSchedule();
    }

    public listScheduleRuleInRange(startDate, endDate) {
        let date1 = validateDate(startDate, null);
        let date2 = validateDate(endDate, null);
        let date = [];
        let loop = date1;

        date.push({ date: this.convertToDateString(loop), day: loop.getUTCDay() });

        // Crio um array de um objeto que apresenta uma data e um valor referente ao dia da semana da mesma.
        // São criados valores de acordo com o itnervalo inferior e superior, startDate e endDate.
        // Ex startDate =25-10-2021 e endDate = 27-10-2021
        // o array será [{date:25-10-2021,day:1},{date:26-10-2021,day:2},{date:27-10-2021,day:3},{date:28-10-2021,day:4}]
        // Em seguida é feita uma busca no banco de dados dos horários que existem nesses dias.
        if (date2 > date1) {
            while (loop.getTime() !== date2.getTime()) {
                loop.setDate(loop.getDate() + 1);
                date.push({ date: this.convertToDateString(loop), day: loop.getUTCDay() });
            }
            let data = scheduleDao.listScheduleByDateAndDaysOfWeek(date);
            return data;
        } else {
            throw ApplicationError.newErrorInvalidDateInterval();
        }


    }


    convertToDateString(date) {
        let d = date.getUTCDate();
        let m = date.getMonth() + 1;
        let a = date.getFullYear();
        console.log(date);
        if (d < 10) {
            d = '0' + d;
        }
        if (m < 10) {
            m = '0' + m;
        }
        return d + '-' + m + '-' + a;
    }

}


export default new ScheduleService();