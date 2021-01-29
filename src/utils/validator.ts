import Interval from "../model/intevals";
import Schedule from "../model/schedule";
import { ApplicationError } from "./error";



export function validateStringInterval(string: String) {
    //Verifica se o formato da escrita dos intervalos estão corretos
    try {
        let arr = string.split(':');
        if (arr.length == 2) {
            let h = parseInt(arr[0]);
            let min = parseInt(arr[1]);
            if ((h >= 0 && h < 24) && (min >= 0 && min < 60)) {
                return true;
            }

        }
    } catch (error) {
    }
    return false;

}


export function validateIntervals(rule: Schedule) {
    // Valida todos os intervalos de de formas diversas.

    if (Array.isArray(rule.intervals) && rule.intervals.length > 0) {
        for (let i of rule.intervals) {
            //Verifica se o formato e se o inical é maior que o final
            validateInterval(i.start, i.end, rule);
        }
        // Verifica se os horários não se chocam entre si
        validateIntervalUnion(rule);
        return true;
    }
    throw ApplicationError.newErrorIntervaloNulo(rule);

}

export function validateInterval(start: String, end: String, rule: Schedule) {
    let e1 = false;
    let e2 = false;
    //Valida os intervalos separadamente para exibir uma mensagem de erro especifica se necessário.
    if (!validateStringInterval(start)) {
        e1 = true;
    }
    if (!validateStringInterval(end)) {
        e2 = true;
    }
    if (e1 && e2) {
        throw ApplicationError.newErrorInvalidIntervalMultiple(start, end, rule);
    } else {
        if (e1) {
            throw ApplicationError.newErrorInvalidIntervalSingle(start, rule);
        }
        if (e2) {
            throw ApplicationError.newErrorInvalidIntervalSingle(end, rule);
        }
    }

    let arr1 = start.split(':');
    let arr2 = end.split(':');

    let h1 = parseInt(arr1[0]);
    let m1 = parseInt(arr1[1]);
    let h2 = parseInt(arr2[0]);
    let m2 = parseInt(arr2[1]);

    if (h2 > h1) {
        return true;
    } else {
        // Verifica se os intervalos são iguais
        if (h2 == h1 && m2 == m1) {
            throw ApplicationError.newErrorIntevalEqual(start, end, rule);

        }

        if (h2 == h1 && m2 > m1) {
            return true;
        }
    }

    // Se não retronou então o valor inicial é maior que o final.
    throw ApplicationError.newErrorIntevalStartMoreThanEnd(start, end, rule);

}



export function validateIntervalUnion(rule, databaseMode = false) {
    // Verifica se a união dos intervalos passados é vazia.
    let intervals = rule.intervals;

    // Ordena todos os intervalos, pelo atributo start.
    let orderInterval = intervals.sort((a, b) => {
        let arr1 = a.start.split(':');
        let arr2 = b.start.split(':');
        let h1 = parseInt(arr1[0]);
        let m1 = parseInt(arr1[1]);
        let h2 = parseInt(arr2[0]);
        let m2 = parseInt(arr2[1]);


        if (h2 > h1) {
            return -1;
        } else {
            if (h2 == h1 && m2 > m1) {
                return -1;
            }
            if (h2 < h1 || m2 < m1) {
                return 1;
            }
        }
        return 0;
    });

    // Verifica se existe algum atributo start antes do atributo end do intervalo anterior.
    // Se existir, dispara uma exceção.
    orderInterval.sort((a, b) => {
        let arr1 = a.start.split(':');
        let arr2 = b.end.split(':');
        let h1 = parseInt(arr1[0]);
        let m1 = parseInt(arr1[1]);
        let h2 = parseInt(arr2[0]);
        let m2 = parseInt(arr2[1]);

        if (h1 < h2) {
            if (databaseMode) {
                throw ApplicationError.newErrorIntervalUnionDatabase(rule, a, b);
            } else {
                throw ApplicationError.newErrorIntervalUnion(rule, a, b);
            }
        } else {
            if (h2 == h1 && m1 < m2) {
                if (databaseMode) {
                    throw ApplicationError.newErrorIntervalUnionDatabase(rule, a, b);
                } else {
                    throw ApplicationError.newErrorIntervalUnion(rule, a, b);
                }
            }
        }
        return 0;
    });

}




export function validateDate(date: String, rule) {

    let d = validateDateString(date, rule);
    if (d) {
        let compareDate = new Date(); // Cria uma data para comparar ignorando o horário atual.
        compareDate.setHours(0, 0, 0, 0);
        // Valida se a data já passou
        if (d < compareDate) {
            throw ApplicationError.newErrorDateHasBenPassed(date, rule);
        }
        /*
               É possivel adicionar um horário mesmo que já tenha passado, porém como existem diferentes fusos horários no Brasil,
               acredito que deixar esta possibilidade não é uma falha na válidação. 
           */
        return d;
    }
}

export function validateDateString(date: String, rule = null) {
    // Faço a verificação da string refente a data, se ela é do tipo 'DD-MM-AAAA' e se é uma data válida
    // Defini uma data válida quando o ano é maior que 1900, isso quando o formato for todo válido.
    let arr = date.split('-');
    if (arr.length == 3) {
        let day = parseInt(arr[0]);
        let month = parseInt(arr[1]);
        let year = parseInt(arr[2]);
        let d = new Date(year + '-' + month + '-' + day);
        if (d.getTime()) {
            if (year >= 1900) { //Restringir o sistema a aceitar uma data minima 
                return d;
            } else {
                throw ApplicationError.newErrorDateInvalid(date, rule);

            }
        }
    }
    throw ApplicationError.newErrorDateInvalid(date, rule);
}



export function validateDaysInWeek(rule) {
    // Válida os dias se o vetor de dias das semanas esta correto.
    // Inválida valores > 6 e < 0, array.length > 7 e < 1 e também se houver valores repetidos.
    if (Array.isArray(rule.daysInWeek) && (rule.daysInWeek.length > 0 && rule.daysInWeek.length <= 7)) { // Verifica se é um Array e se não possui um tamanho maior que o limite 
        rule.daysInWeek.filter((val, index, self) => {
            if (val > 6 || self.indexOf(val) != index) {  // Verifica se o dia é maior do que os dias possiveis [0,6] e se existem dias  repetidos. 
                throw ApplicationError.newErrorDaysOfWeek(rule);
            }
        });
        return rule;
    } else {
        throw ApplicationError.newErrorDaysOfWeek(rule);
    }
}
