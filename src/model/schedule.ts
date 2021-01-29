import { ScheduleRuleType } from "../utils/enums";
import Interval from "./intevals";

export default class Schedule {

    public id: string;
    public type: ScheduleRuleType;
    public day: String;
    public intervals: Array<Interval>;
    public daysInWeek: Array<Number>;

    constructor(type: ScheduleRuleType, intervals: Array<Interval>, day: String, daysInWeek: Array<Number>) {
        this.id = this.createUniqueId();
        this.type = type;
        this.intervals = intervals;
        this.day = day;
        this.daysInWeek = daysInWeek;
    }


    createUniqueId() {
        let idPart1 = Date.now();
        let str = new String(Date.now());
        let Idpart2 = str[this.getRandomInt(0, str.length - 1)] + str[this.getRandomInt(0, str.length - 1)] + str[this.getRandomInt(0, str.length - 1)];
        return idPart1 + '-' + Idpart2;
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
} 