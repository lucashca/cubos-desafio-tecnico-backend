import e from "express";
import Interval from "../src/model/intevals";
import { ApplicationError } from "../src/utils/error";
import { validateDate, validateDateString, validateDaysInWeek, validateInterval, validateIntervals, validateIntervalUnion, validateStringInterval } from "../src/utils/validator";

describe('Testando os métodos de validação do sistema', () => {


    test('validateStringInterval validar o tipo de string para os atributos de intervalos', () => {

        let incorretString = '1410';
        expect(validateStringInterval(incorretString)).toBe(false);

        incorretString = '14:60';
        expect(validateStringInterval(incorretString)).toBe(false);

        incorretString = '24:10';
        expect(validateStringInterval(incorretString)).toBe(false);

        incorretString = '-14:10';
        expect(validateStringInterval(incorretString)).toBe(false);

        incorretString = '14:-1';
        expect(validateStringInterval(incorretString)).toBe(false);

        incorretString = '-1:10';
        expect(validateStringInterval(incorretString)).toBe(false);

        incorretString = '14:10:10';
        expect(validateStringInterval(incorretString)).toBe(false);

        let correctString = "14:10";
        expect(validateStringInterval(correctString)).toBe(true);

        correctString = "00:59";
        expect(validateStringInterval(correctString)).toBe(true);

        correctString = "23:59";
        expect(validateStringInterval(correctString)).toBe(true);

    });

    test('validateInterval verificar se um intervalo é válido', () => {

        let intervalError1 = { start: '15:50', end: '15:20' };
        let intervalError2 = { start: '15:50', end: '15:50' };
        let intervalError3 = { start: '15:50', end: '155:50' };
        let intervalError4 = { start: '155:50', end: '15:50' };
        let intervalError5 = { start: '156:50', end: '156:50' };

        let correctInterval = { start: '15:00', end: '15:20' };


        function fError1() {
            validateInterval(intervalError1.start, intervalError1.end, null);
        }

        function fError2() {
            validateInterval(intervalError2.start, intervalError2.end, null);
        }

        function fError3() {
            validateInterval(intervalError3.start, intervalError3.end, null);
        }


        function fError4() {
            validateInterval(intervalError4.start, intervalError4.end, null);
        }


        function fError5() {
            validateInterval(intervalError5.start, intervalError5.end, null);
        }





        let error1: any = ApplicationError.newErrorIntevalStartMoreThanEnd(intervalError1.start, intervalError1.end, null);
        let error2: any = ApplicationError.newErrorIntevalEqual(intervalError2.start, intervalError2.end, null);
        let error3: any = ApplicationError.newErrorInvalidIntervalSingle(intervalError3.end, null);
        let error4: any = ApplicationError.newErrorInvalidIntervalSingle(intervalError4.start, null);
        let error5: any = ApplicationError.newErrorInvalidIntervalMultiple(intervalError5.start, intervalError5.end, null);


        expect(fError1).toThrowError(error1);
        expect(fError2).toThrowError(error2);
        expect(fError3).toThrowError(error3);
        expect(fError4).toThrowError(error4);
        expect(fError5).toThrowError(error5);



        expect(validateInterval(correctInterval.start, correctInterval.end, null)).toBe(true);


    });


    test('validateIntervalUnion valida a união de intervalos com o banco de dados', () => {
        let ruleError: any = {};
        let intervalError: Interval[] = [];

        intervalError.push({ start: '14:10', end: '15:20' });
        intervalError.push({ start: '15:10', end: '15:50' });

        ruleError.intervals = intervalError;

        function fErrorNoDatabase() {
            validateIntervalUnion(ruleError, false);
        }

        function fErrorDatabase() {
            validateIntervalUnion(ruleError, true);
        }





        let errorNoDb: any = ApplicationError.newErrorIntervalUnion(ruleError, { start: '15:10', end: '15:50' }, { start: '14:10', end: '15:20' });
        let errorDb: any = ApplicationError.newErrorIntervalUnionDatabase(ruleError, { start: '15:10', end: '15:50' }, { start: '14:10', end: '15:20' });

        expect(fErrorNoDatabase).toThrowError(errorNoDb);
        expect(fErrorDatabase).toThrowError(errorDb);


        intervalError = [];
        intervalError.push({ start: '14:11', end: '14:20' });
        intervalError.push({ start: '14:10', end: '14:15' });

        ruleError.intervals = intervalError;

        errorNoDb = ApplicationError.newErrorIntervalUnion(ruleError, { start: '14:11', end: '14:20' }, { start: '14:10', end: '14:15' });
        errorDb = ApplicationError.newErrorIntervalUnionDatabase(ruleError, { start: '14:11', end: '14:20' }, { start: '14:10', end: '14:15' });

        expect(fErrorNoDatabase).toThrowError(errorNoDb);
        expect(fErrorDatabase).toThrowError(errorDb);


        intervalError = [];
        intervalError.push({ start: '14:10', end: '14:20' });
        intervalError.push({ start: '14:10', end: '14:15' });

        ruleError.intervals = intervalError;

        errorNoDb = ApplicationError.newErrorIntervalUnion(ruleError, { start: '14:10', end: '14:15' }, { start: '14:10', end: '14:20' });
        errorDb = ApplicationError.newErrorIntervalUnionDatabase(ruleError, { start: '14:10', end: '14:15' }, { start: '14:10', end: '14:20' });

        expect(fErrorNoDatabase).toThrowError(errorNoDb);
        expect(fErrorDatabase).toThrowError(errorDb);


        intervalError = [];
        intervalError.push({ start: '01:10', end: '03:20' });
        intervalError.push({ start: '02:10', end: '02:15' });

        ruleError.intervals = intervalError;

        errorNoDb = ApplicationError.newErrorIntervalUnion(ruleError, { start: '02:10', end: '02:15' }, { start: '01:10', end: '03:20' });
        errorDb = ApplicationError.newErrorIntervalUnionDatabase(ruleError, { start: '02:10', end: '02:15' }, { start: '01:10', end: '03:20' });

        expect(fErrorNoDatabase).toThrowError(errorNoDb);
        expect(fErrorDatabase).toThrowError(errorDb);

        intervalError = [];
        intervalError.push({ start: '01:10', end: '03:20' });
        intervalError.push({ start: '02:10', end: '02:15' });

        ruleError.intervals = intervalError;

        errorNoDb = ApplicationError.newErrorIntervalUnion(ruleError, { start: '02:10', end: '02:15' }, { start: '01:10', end: '03:20' });
        errorDb = ApplicationError.newErrorIntervalUnionDatabase(ruleError, { start: '02:10', end: '02:15' }, { start: '01:10', end: '03:20' });

        expect(fErrorNoDatabase).toThrowError(errorNoDb);
        expect(fErrorDatabase).toThrowError(errorDb);







    });

    test('validateIntervals validar os intervalos de de forma completa', () => {
        // Na função validateIntervals são chamadas outras funções de validações que já foram testadas anteriormente.

        let ruleError: any = {};
        let intervalError: Interval[] = [];

        intervalError.push({ start: '14:10', end: '15:20' });
        intervalError.push({ start: '15:10', end: '15:50' });

        ruleError.intervals = intervalError;

        function fError() {
            validateIntervals(ruleError);
        }




        let error: any = ApplicationError.newErrorIntervalUnion(ruleError, { start: '15:10', end: '15:50' }, { start: '14:10', end: '15:20' });
        expect(fError).toThrowError(error);


        intervalError = [];

        intervalError.push({ start: '14:10', end: '15:20' });
        intervalError.push({ start: '11:10', end: '12:50' });
        intervalError.push({ start: '13:10', end: '14:50' });

        ruleError.intervals = intervalError;


        error = ApplicationError.newErrorIntervalUnion(ruleError, { start: '14:10', end: '15:20' }, { start: '13:10', end: '14:50' });
        expect(fError).toThrowError(error);

        ruleError.intervals = [];

        error = ApplicationError.newErrorIntervaloNulo(ruleError);
        expect(fError).toThrowError(error);





        let corretRule: any = {};
        let interval: Interval[] = [];

        interval.push({ start: '14:10', end: '15:20' });
        interval.push({ start: '16:10', end: '17:50' });

        corretRule.intervals = interval;

        expect(validateIntervals(corretRule)).toBe(true);

    });



    test("validateDate valida um strig correspondet a data no padrão 'dd-mm-aaaa' ", () => {

        let errDate1 = '60-10-2021';
        let errDate2 = '14-13-2021';
        let errDate3 = '142-102-20212';
        let errDate4 = '14-10-1994-205';
        let errDate5 = '14-10-1899';

        let passedDate2 = '14-01-2021';

        let correctDate = '12-10-2021';

        let error1: any = ApplicationError.newErrorDateInvalid(errDate1, null);
        let error2: any = ApplicationError.newErrorDateInvalid(errDate2, null);
        let error3: any = ApplicationError.newErrorDateInvalid(errDate3, null);
        let error4: any = ApplicationError.newErrorDateInvalid(errDate4, null);
        let error5: any = ApplicationError.newErrorDateInvalid(errDate5, null);
        let error6: any = ApplicationError.newErrorDateHasBenPassed(passedDate2, null);


        function err1() {
            validateDate(errDate1, null);
        }
        function err2() {
            validateDate(errDate2, null);
        }
        function err3() {
            validateDate(errDate3, null);
        }
        function err4() {
            validateDate(errDate4, null);
        }
        function err5() {
            validateDate(errDate5, null);
        }
        function err6() {
            validateDate(passedDate2, null);
        }


        expect(err1).toThrowError(error1);
        expect(err2).toThrowError(error2);
        expect(err3).toThrowError(error3);
        expect(err4).toThrowError(error4);
        expect(err5).toThrowError(error5);
        expect(err6).toThrowError(error6);
        expect(validateDate(correctDate, null)).toBeInstanceOf(Date);


    });



    test('validateDaysInWeek valida o array de dias na semana', () => {
        let error1 = { daysInWeek: [0, 1, 2, 3, 4, 5, 6, 7] };
        let error2 = { daysInWeek: [0, 0] };
        let error3 = { daysInWeek: [9] };
        let correct1 = { daysInWeek: [0, 1, 2, 3, 4, 5, 6] };
        let correct2 = { daysInWeek: [0] };

        function err1() {
            validateDaysInWeek(error1);
        }
        function err2() {
            validateDaysInWeek(error2);
        }
        function err3() {
            validateDaysInWeek(error3);
        }


        let e1: any = ApplicationError.newErrorDaysOfWeek(error1);
        let e2: any = ApplicationError.newErrorDaysOfWeek(error2);
        let e3: any = ApplicationError.newErrorDaysOfWeek(error3);

        expect(err1).toThrowError(e1);
        expect(err2).toThrowError(e2);
        expect(err3).toThrowError(e3);

        expect(validateDaysInWeek(correct1)).toBe(correct1);
        expect(validateDaysInWeek(correct2)).toBe(correct2);



    });

});