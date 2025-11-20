/**
 * Dynamics configuration
 *
 * Small config wrapper for calling Microsoft Dynamics APIs. The object
 * `bearerTokenRequest` contains the information required to request a
 * client-credentials bearer token. Values are read from environment
 * variables so secrets are not checked into source control.
 *
 * Expected environment variables:
 * - `DYNAMICS_AUTH_URL`      : token endpoint
 * - `DYNAMICS_URL`           : resource / base URL for Dynamics
 * - `DYNAMICS_CLIENT_ID`     : client id for app registration
 * - `DYNAMICS_CLIENT_SECRET` : client secret
 */

const bearerTokenRequest = {
  url: process.env.DYNAMICS_AUTH_URL,
  resource: process.env.DYNAMICS_URL,
  grantType: "client_credentials",
  clientId: process.env.DYNAMICS_CLIENT_ID,
  clientSecret: process.env.DYNAMICS_CLIENT_SECRET,
};

const dynamicsUrl = process.env.DYNAMICS_URL;

module.exports = { bearerTokenRequest, dynamicsUrl };
