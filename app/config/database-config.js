/**
 * Database configuration
 *
 * Builds a Sequelize-compatible configuration object using environment
 * variables. In production the module attempts to acquire an Azure AD
 * access token using `DefaultAzureCredential` (managed identity) and uses
 * the token as the DB password — this is the secure pattern used for
 * Azure-managed PostgreSQL with AAD authentication.
 *
 * The exported shape contains entries for the common environments used by
 * the project (`development`, `production`, `test`) and is intended to be
 * consumed by Sequelize or migration tooling.
 */

const { DefaultAzureCredential } = require("@azure/identity");
const { development, production, test } = require("./constants").environments;

function isProd() {
  return process.env.NODE_ENV === production;
}

// Sequelize hook that can inject an access token as the password when running
// in production and using Azure AD authentication for the database.
const hooks = {
  beforeConnect: async (cfg) => {
    if (isProd()) {
      const credential = new DefaultAzureCredential({
        managedIdentityClientId: process.env.AZURE_CLIENT_ID,
      });

      const accessToken = await credential.getToken(
        "https://ossrdbms-aad.database.windows.net/.default",
      );

      cfg.password = accessToken.token;
    }
  },
};

// Retry policy for transient DB connection errors
const retry = {
  backoffBase: 500,
  backoffExponent: 1.1,
  match: [/SequelizeConnectionError/],
  max: 10,
  name: "connection",
  timeout: 60000,
};

const dbConfig = {
  database: process.env.POSTGRES_DB,
  dialect: "postgres",
  dialectOptions: {
    ssl: isProd(),
  },
  hooks,
  host: process.env.POSTGRES_HOST || "trade-exportscore-plp-postgres",
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  logging: process.env.POSTGRES_LOGGING || false,
  retry,
  schema: process.env.POSTGRES_SCHEMA_NAME || "public",
  username: process.env.POSTGRES_USERNAME,
};

const config = {};
config[development] = dbConfig;
config[production] = dbConfig;
config[test] = dbConfig;

module.exports = config;
