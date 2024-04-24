const dotenv = require("dotenv");
const joi = require("joi");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = joi
    .object()
    .keys({
        NODE_ENV: joi
            .string()
            .valid("production", "development", "test")
            .required(),
        APP_PORT: joi.number().positive().required(),
        DB: joi.string().required(),
        DB_USER: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().required(),
        MAILTRAP_HOST: joi.string().required(),
        MAILTRAP_USER: joi.string().required(),
        MAILTRAP_PASS: joi.string().required(),
        MAILTRAP_EMAIL: joi.string().required(),
        INTERVAL_TIME_IN_MIN: joi.number().required()
    })
    .unknown();

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    appEnv: envVars.NODE_ENV,
    appPort: envVars.APP_PORT,
    dbName: envVars.DB,
    dbUser: envVars.DB_USER,
    dbPassword: envVars.DB_PASSWORD,
    dbHost: envVars.DB_HOST,
    dbPort: envVars.DB_PORT,
    mailtrapHost: envVars.MAILTRAP_HOST,
    mailtrapUser: envVars.MAILTRAP_USER,
    mailtrapPass: envVars.MAILTRAP_PASS,
    mailTrapEmail: envVars.MAILTRAP_EMAIL,
    mailCheckInterval : envVars.INTERVAL_TIME_IN_MIN
}