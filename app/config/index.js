const joi = require("joi");
const path = require("path");
const mq_config = require("./mq-config");
const db_config = require("./database-config");
const dynamics_config = require("./dynamics-config");
const { development, production, test } = require("./constants").environments;
const schema_default_port = 3004;

// Define config schema
const schema = joi.object({
  port: joi.number().default(schema_default_port),
  env: joi.string().valid(development, test, production).default(development),
});

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
};

// Validate config
const result = schema.validate(config, {
  abortEarly: false,
});

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`);
}

// Use the Joi validated value
const value = result.value;

// Add some helper props
value.isDev = value.env === development;
value.isProd = value.env === production;

value.dbConfig = db_config;
value.plpSubscription = mq_config.plpSubscription;
value.tpQueue = mq_config.tpQueue;
value.dynamicsConfig = dynamics_config;

// AI values
value.formRecognizerEndpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
value.formRecognizerApiKey = process.env.FORM_RECOGNIZER_API_KEY;

value.plDir = path.join(process.cwd(), "/app/packing-lists/");

// TP/IDCOMS toggle
value.isDynamicsIntegration = process.env.IS_DYNAMICS_INTEGRATION === "true";

// DI toggle
value.isDiEnabled = process.env.IS_DOCUMENT_INTLELLIGENCE_ENABLED === "true";

module.exports = value;
