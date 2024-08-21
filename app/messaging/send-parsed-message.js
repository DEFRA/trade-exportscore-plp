const config = require("../config");
const { MessageSender } = require("adp-messaging");
const createMessage = require("./create-message");
const { ServiceBusClient } = require("@azure/service-bus");
const { DefaultAzureCredential } = require("@azure/identity");

async function sendParsedAdp(parsedResult, applicationId) {
  const message = createMessage(parsedResult, applicationId);
  const parsedSender = new MessageSender(config.tpQueue);
  await parsedSender.sendMessage(message);
  await parsedSender.closeConnection();
  console.info(
    `Sent message to TP queue for application id ${applicationId} with parsed result ${parsedResult}`,
  );
}

async function sendParsed(parsedResult, applicationId) {
  const credential = new DefaultAzureCredential({ 
    managedIdentityClientId: config.tpQueue.managedIdentityClientId,
    tenantId: config.tpQueue.tenantId,
  });

  const sbClient = new ServiceBusClient(config.tpQueue.host, credential);
  const sender = sbClient.createSender(config.tpQueue.address);

  const message = createMessage(parsedResult, applicationId);

  try {
    await sender.sendMessages(message);
    console.info(
      `Sent message to TP queue for application id ${applicationId} with parsed result ${parsedResult}`,
    );
    await sender.close();
  }
  catch (err) {
    console.error(err)
  }
  finally {
    await sbClient.close();
  }
}

module.exports = { sendParsed };
