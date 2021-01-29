import express from 'express';
import cors from 'cors';
import routes from './routes';
import http from 'http';
import fs from 'fs';
import ScheduleDao from './dao/scheduleDao';
import scheduleDao from './dao/scheduleDao';



export default class Server {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();

    }


    public startHttp(port: number): void {
        const server = http.createServer(this.express);
        server.listen(port,
            () => { console.log('Server is running :', port); });
    }

    private middlewares(): void {
        this.express.use(express.json());
    }

    private routes(): void {
        this.express.use(routes);
    }


}
