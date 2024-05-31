const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");
const { DefaultAzureCredential } = require("@azure/identity");

const fullyQualifiedNamespace = process.env.MESSAGE_QUEUE_HOST;
const queueName = process.env.TEAM_NAME + "-plingestion";
const credential = new DefaultAzureCredential();

 async function main() {

    const sbClient = new ServiceBusClient(fullyQualifiedNamespace, credential);
    const receiver = sbClient.createReceiver(queueName);

    const myMessageHandler = async (messageReceived) => {
        console.log(`Received message: ${messageReceived.body}`);
    };

    const myErrorHandler = async (error) => {
        console.log(error);
    };

    receiver.subscribe({
        processMessage: myMessageHandler,
        processError: myErrorHandler
    });

    await delay(20000);
    await receiver.close();
    await sbClient.close();
}
main().catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
 });