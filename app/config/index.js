const Joi = require("joi");
const path = require("path");
const mqConfig = require("./mq-config");
const dbConfig = require("./database-config");
const dynamicsConfig = require("./dynamics-config");
const { development, production, test } = require("./constants").environments;
const schemaDefaultPort = 3004;

// Define config schema
const schema = Joi.object({
  port: Joi.number().default(schemaDefaultPort),
  env: Joi.string().valid(development, test, production).default(development),
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

value.dbConfig = dbConfig;
value.plpSubscription = mqConfig.plpSubscription;
value.parsedQueue = mqConfig.parsedQueue;
value.dynamicsConfig = dynamicsConfig;

value.plDir = path.join(process.cwd(), "/app/packing-lists/");

module.exports = value;
