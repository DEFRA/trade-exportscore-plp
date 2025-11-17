/**
 * Application configuration builder
 *
 * Validates minimal runtime configuration with Joi and exposes a single
 * `value` object consumed by the server and other modules. Configuration is
 * primarily provided via environment variables so this module is safe to
 * require early during startup.
 */

const joi = require("joi");
const path = require("node:path");
const messageQueueConfig = require("./mq-config");
const dbConfig = require("./database-config");
const dynamicsConfig = require("./dynamics-config");
const { development, production, test } = require("./constants").environments;
const schemaDefaultPort = 3004;

// Define config schema
const schema = joi.object({
  port: joi.number().default(schemaDefaultPort),
  env: joi.string().valid(development, test, production).default(development),
});

// Build config from environment
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

// Add some helper props for convenience
value.isDev = value.env === development;
value.isProd = value.env === production;

// Attach other config pieces used by the app
value.dbConfig = dbConfig;
value.plpSubscription = messageQueueConfig.plpSubscription;
value.tpQueue = messageQueueConfig.tpQueue;
value.dynamicsConfig = dynamicsConfig;

// AI values
value.formRecognizerEndpoint = process.env.FORM_RECOGNIZER_ENDPOINT;

// Local packing-list directory used in non-AI tests and development
value.plDir = path.join(process.cwd(), "/app/packing-lists/");

// Document Intelligence toggle (string 'true' in env to enable)
value.isDiEnabled = process.env.IS_DOCUMENT_INTLELLIGENCE_ENABLED === "true";

module.exports = value;
