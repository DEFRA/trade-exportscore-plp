const bearerTokenRequest = {
  url: process.env.DYNAMICS_AUTH_URL,
  resource: process.env.DYNAMICS_URL,
  grantType: "client_credentials",
  clientId: process.env.DYNAMICS_CLIENT_ID,
  clientSecret: process.env.DYNAMICS_CLIENT_SECRET,
};

const dynamicsUrl = process.env.DYNAMICS_URL;

module.exports = { bearerTokenRequest, dynamicsUrl };
