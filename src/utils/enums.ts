export enum ErrorCodEnum {
    INVALID_INTERVAL = 100,
    INVALID_DAY = 101,
    INVALID_DAYSOFWEEK = 102,
    ID_NOT_FOUND = 103,
    ERROR_ON_SAVE = 104,
    INVALID_TYPE = 105,
}

export enum ScheduleRuleType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    SPECIFIC_DATE = "SPECIFIC_DATE"
}