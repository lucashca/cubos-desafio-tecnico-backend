import { json } from "express";
import { ErrorCodEnum } from "./enums";

export class ApplicationError {


    public code: ErrorCodEnum;
    public message: String;
    public objectInvalid: any;

    constructor(code, message, objectInvalid = null) {
        this.code = code;
        this.message = message;
        this.objectInvalid = objectInvalid;
    }


    public static newErrorInvalidIntervalSingle(interval, obj) {
        let msg = "Intervalo inválido: O valor '" + interval + "' não é válido.";
        return new ApplicationError(ErrorCodEnum.INVALID_INTERVAL, msg, obj);
    }


    public static newErrorInvalidIntervalMultiple(start, end, obj) {
        let msg = "Intervalo inválido: Os valores '" + start + "' e '" + end + "' não sao válidos.";
        return new ApplicationError(ErrorCodEnum.INVALID_INTERVAL, msg, obj);
    }

    public static newErrorIntevalStartMoreThanEnd(start, end, obj) {
        let msg = "Intervalo inválido: Os valores '" + start + "' e maior que '" + end + "'.";
        return new ApplicationError(ErrorCodEnum.INVALID_INTERVAL, msg, obj);
    }


    public static newErrorIntevalEqual(start, end, obj) {
        let msg = "Intervalo inválido: Os valores '" + start + "' e '" + end + "' são iguais.";
        return new ApplicationError(ErrorCodEnum.INVALID_INTERVAL, msg, obj);
    }

    public static newErrorIntervaloNulo(object) {
        return new ApplicationError(ErrorCodEnum.INVALID_INTERVAL, "Verifique suas regras, os intervalos não podem ser nulos.", object);
    }


    public static newErrorDateInvalid(date, obj) {
        let msg = "A data '" + date + "' não é válida.";
        return new ApplicationError(ErrorCodEnum.INVALID_DAY, msg, obj);
    }

    public static newErrorDateHasBenPassed(date, obj) {
        let msg = "A data '" + date + "' já passou!";
        return new ApplicationError(ErrorCodEnum.INVALID_DAY, msg, obj);
    }

    public static newErrorIntervalUnion(obj, a, b) {
        let msg = "A união dos intervalos  {start:'" + a.start + "',end:'" + a.end + "'} , {start:'" + b.start + "',end:'" + b.end + "'}. não é vazia.";
        return new ApplicationError(ErrorCodEnum.INVALID_INTERVAL, msg, obj);
    }

    public static newErrorIntervalUnionDatabase(obj, a, b) {
        let msg = "Intervalo em conflito com o banco de dados. {start:'" + a.start + "',end:'" + a.end + "'} , {start:'" + b.start + "',end:'" + b.end + "'}.";
        return new ApplicationError(ErrorCodEnum.INVALID_INTERVAL, msg, obj);
    }

    public static newErrorDaysOfWeek(object) {
        return new ApplicationError(ErrorCodEnum.INVALID_DAYSOFWEEK, "Verifique suas regras, o atributo daysOfWeek é inválido", object);
    }

    public static newErrorIdNotFound(id) {
        return new ApplicationError(ErrorCodEnum.ID_NOT_FOUND, "O identificador'" + id + "' não foi encontrado. ");
    }



    public static newErrorNoTypeFound(type, rule) {
        return new ApplicationError(ErrorCodEnum.INVALID_TYPE, "Tipo '" + type + "' não é válido.", rule);
    }



    public static newErrorInvalidDateInterval() {
        return new ApplicationError(ErrorCodEnum.INVALID_TYPE, "O interválo informado não é válido.");
    }



}