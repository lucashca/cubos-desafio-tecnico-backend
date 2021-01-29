
import scheduleController from "../src/controller/scheduleController";
import Schedule from "../src/model/schedule";
import Server from "../src/server";
import request from 'supertest';


describe('Testar as funcionalidades da api: : Testes devem ser feito com o banco de dados vazio', () => {

    test('save rules', async function (done) {

        let correctIterval1 = [{ start: '01:10', end: '01:20' }, { start: '01:30', end: '01:40' }];
        let correctIterval2 = [{ start: '02:10', end: '02:20' }, { start: '02:30', end: '02:40' }];
        let correctIterval3 = [{ start: '03:10', end: '03:20' }, { start: '03:30', end: '03:40' }];
        let correctIterval4 = [{ start: '04:10', end: '04:20' }, { start: '04:30', end: '04:40' }];
        let correctIterval5 = [{ start: '05:10', end: '05:20' }, { start: '05:30', end: '05:40' }];
        let correctIterval6 = [{ start: '06:10', end: '06:20' }, { start: '06:30', end: '06:40' }];
        let correctIterval7 = [{ start: '07:10', end: '07:20' }, { start: '07:30', end: '07:40' }];

        let errorInterval = [{ start: '15:10', end: '15:40' }, { start: '15:10', end: '15:25' }];

        let correctDay1 = '23-10-2021';
        let correctDay2 = '02-09-2021';
        let incorretDay = '23-01-2021';
        let correctDaysInWeek = [0, 1, 2, 3];
        let incorretDaysInWeek = [0, 1, 9];



        let scheduleRuleDaily1 = { type: 'DAILY', intervals: correctIterval1 };
        let scheduleRuleWeekly1 = { type: 'WEEKLY', intervals: correctIterval2, daysInWeek: correctDaysInWeek };
        let scheduleRuleSpecific1 = { type: 'SPECIFIC_DATE', intervals: correctIterval3, day: correctDay1 };

        let scheduleRuleDaily2 = { type: 'DAILY', intervals: correctIterval4 };
        let scheduleRuleWeekly2 = { type: 'WEEKLY', intervals: correctIterval5, daysInWeek: correctDaysInWeek };
        let scheduleRuleSpecific2 = { type: 'SPECIFIC_DATE', intervals: correctIterval6, day: correctDay2 };



        let incorrectSchedule1 = { type: 'DAILY', intervals: errorInterval };
        let incorrectSchedule2 = { type: 'WEEKLY', intervals: errorInterval, daysInWeek: correctDaysInWeek };
        let incorrectSchedule3 = { type: 'SPECIFIC_DATE', intervals: errorInterval, day: correctDay1 };
        let incorrectSchedule4 = { type: 'AAA', intervals: correctIterval7, day: correctDay2 };


        let schedules = [scheduleRuleDaily2, scheduleRuleWeekly2, scheduleRuleSpecific2];

        let incorretSchedules = [incorrectSchedule1, incorrectSchedule2, incorrectSchedule3];

        const server = new Server();


        //Teste deve ser realizado com o banco e dados vazio
        //Cadastrar um regra 
        await request(server.express).post('/saveRules').send(scheduleRuleDaily1).expect(201);
        await request(server.express).post('/saveRules').send(scheduleRuleWeekly1).expect(201);
        await request(server.express).post('/saveRules').send(scheduleRuleSpecific1).expect(201);
        await request(server.express).post('/saveRules').send(schedules).expect(201);

        //intervalos já cadastrado
        await request(server.express).post('/saveRules').send(scheduleRuleDaily1).expect(401);
        await request(server.express).post('/saveRules').send(scheduleRuleWeekly1).expect(401);
        await request(server.express).post('/saveRules').send(scheduleRuleSpecific1).expect(401);
        await request(server.express).post('/saveRules').send(schedules).expect(401);

        await request(server.express).post('/saveRules').send(incorrectSchedule1).expect(401);
        await request(server.express).post('/saveRules').send(incorrectSchedule2).expect(401);
        await request(server.express).post('/saveRules').send(incorrectSchedule3).expect(401);
        let r = await request(server.express).post('/saveRules').send(incorrectSchedule4).expect(401);
        console.log(r.body);
        await request(server.express).post('/saveRules').send(incorretSchedules).expect(401);


        done();

    });


    test('delete schedule', async function (done) {
        let correctIterval1 = [{ start: '10:10', end: '10:20' }, { start: '10:30', end: '10:40' }];
        let scheduleRuleDaily1 = { type: 'DAILY', intervals: correctIterval1 };


        const server = new Server();

        //Teste deve ser realizado com o banco e dados vazio
        //Cadastrar um regra 
        let r = await request(server.express).post('/saveRules').send(scheduleRuleDaily1).expect(201);

        let id = r.body[0].id;


        await request(server.express).delete('/deleteScheduleRuleById/' + id).expect(200);
        await request(server.express).delete('/deleteScheduleRuleById/aaaaa').expect(401);


        done();

    });


    test('list schedlues', async function (done) {

        const server = new Server();

        //Teste deve ser realizado com o banco e dados vazio
        //Cadastrar um regra 
        await request(server.express).get('/listScheduleRule').expect(200);


        done();

    });
    test('list schedyles by date', async function (done) {


        let passedDate1 = '14-10-1994';

        let correctDate1 = '23-10-2021';
        let correctDate2 = '23-11-2021';
        let correctDate3 = '02-05-2021';
        let correctDate4 = '05-06-2021';

        let errDate1 = '35-10-2020';
        let errDate2 = '15-18-2021';


        const server = new Server();

        //Teste deve ser realizado com o banco e dados vazio
        //Cadastrar um regra 
        await request(server.express).get('/listScheduleRuleInRange/' + correctDate1 + '/' + correctDate2).expect(200);
        await request(server.express).get('/listScheduleRuleInRange/' + correctDate3 + '/' + correctDate4).expect(200);


        await request(server.express).get('/listScheduleRuleInRange/' + passedDate1 + '/' + correctDate1).expect(401);
        await request(server.express).get('/listScheduleRuleInRange/' + correctDate2 + '/' + correctDate1).expect(401);



        await request(server.express).get('/listScheduleRuleInRange/' + correctDate1 + '/' + errDate1).expect(401);
        await request(server.express).get('/listScheduleRuleInRange/' + errDate1 + '/' + correctDate2).expect(401);

        await request(server.express).get('/listScheduleRuleInRange/' + correctDate1 + '/' + errDate2).expect(401);
        await request(server.express).get('/listScheduleRuleInRange/' + errDate2 + '/' + correctDate2).expect(401);

        await request(server.express).get('/listScheduleRuleInRange/' + errDate1 + '/' + errDate2).expect(401);
        await request(server.express).get('/listScheduleRuleInRange/' + errDate2 + '/' + errDate1).expect(401);


        done();

    });




});