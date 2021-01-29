import fs from 'fs';
import Schedule from '../model/schedule';
import { ScheduleRuleType } from '../utils/enums';
import { ApplicationError } from '../utils/error';

class ScheduleDao {

    private path = './DATABASE.json';




    saveSchedules(scheduleRule) {

        try {
            // Verifica se o arquivo de banco de dados existe
            // Se existir salva o dado no arquivo
            // Se não existir cria o arquivo e salva o dado.
            if (!fs.existsSync(this.path)) {
                fs.writeFile(this.path, JSON.stringify(scheduleRule), { flag: 'wx' }, function (err) {
                    if (err) throw err;
                });
            } else {
                let file: any = fs.readFileSync(this.path);
                let obj;
                if (file) {
                    try {
                        obj = JSON.parse(file);
                    } catch (error) {

                    }
                }
                if (Array.isArray(obj)) {
                    // Concatena o vetor de regras cadastradas com a(s) nova(s) regra(s)
                    obj = obj.concat(scheduleRule);
                    fs.writeFileSync(this.path, JSON.stringify(obj));
                } else {
                    fs.writeFileSync(this.path, JSON.stringify(scheduleRule));
                }
            }
            return true;
        } catch (error) {

            throw error;
        }
    }

    public deleteScheduleRuleById(id): Boolean {
        let rules = this.listSchedule();
        let contais = false;
        // Percorre pelas regras do sistema para verificar se existe uma com o id especificado
        // A regra será removida.
        rules = rules.filter((val, index, self) => {
            if (val.id === id) {
                contais = true;
                return false;
            } else {
                return true;
            }
        });
        if (contais) {
            fs.writeFileSync(this.path, JSON.stringify(rules));
            return true;
        } else {
            throw ApplicationError.newErrorIdNotFound(id);
        }
    }


    public listSchedule() {
        try {
            let s: any = fs.readFileSync(this.path);
            if (s) {
                return JSON.parse(s);
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }

    }

    public listScheduleByDateAndDaysOfWeek(date) {
        // Nesta função é feita a busca de todas os intervalos de horários que existirão na faixa de data espécifica.
        // É retornado um array de um objeto com os seguintes atributos {day,interval}
        // Para cada dia é encontrado os intervalos de horários disponivieis independente da regra cadastrada.
        // Sendo que cada intervalo é obtido de formas diferentes a depender da regra.
        try {
            let s: any = fs.readFileSync(this.path);
            if (s) {
                let schedules: Schedule[] = JSON.parse(s);
                let returnMap = new Map<string, any>();
                for (let d of date) {
                    for (let s of schedules) {

                        if (s.type == ScheduleRuleType.DAILY) {
                            // Adicionado sem nenhuma verificação pois é diário
                            this.updateMapValue(returnMap, d.date, s.intervals);
                        }
                        if (s.type == ScheduleRuleType.SPECIFIC_DATE) {
                            // Adicionado comparando se um dia no intervalo é o dia específico
                            if (s.day == d.date) {
                                this.updateMapValue(returnMap, d.date, s.intervals);
                            }
                        }
                        // Adicionado comparando se o dia da semana na data do intervalo é o mesmo da regra cadastrada.
                        if (s.type == ScheduleRuleType.WEEKLY) {
                            if (s.daysInWeek.includes(d.day)) {
                                this.updateMapValue(returnMap, d.date, s.intervals);
                            }
                        }
                    }
                }
                // Comverte uma estrutura do tipo Map para um array que será o retorno da função
                let returnData = [];
                for (let k of returnMap.keys()) {
                    returnData.push({
                        day: k,
                        intervals: returnMap.get(k)
                    });
                }

                return returnData;

            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }



    private updateMapValue(map, key, value) {
        let oldValue = map.get(key);
        if (oldValue) {
            value = oldValue.concat(value);
        }
        map.set(key, value);
    }



}

export default new ScheduleDao();