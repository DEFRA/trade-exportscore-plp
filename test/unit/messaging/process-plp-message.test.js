const messageAction = require("../../../app/messaging/process-plp-message");

jest.mock("adp-messaging");
jest.mock("../../../app/services/parser-service");
jest.mock("../../../app/services/storage-account");
jest.mock("../../../app/packing-list");
jest.mock("../../../app/services/dynamics-service");
jest.mock("../../../app/messaging/send-parsed-message");

const { MessageReceiver } = require("adp-messaging");
const { findParser } = require("../../../app/services/parser-service");
const {
  createStorageAccountClient,
  getXlsPackingListFromBlob,
} = require("../../../app/services/storage-account");
const { createPackingList } = require("../../../app/packing-list");
const {
  patchPackingListCheck,
} = require("../../../app/services/dynamics-service");
const ParserModel = require("../../../app/services/parser-model");
const processPlpMessage = require("../../../app/messaging/process-plp-message");
const { sendParsed } = require("../../../app/messaging/send-parsed-message");

createStorageAccountClient.mockImplementation(() => {
  return jest.fn();
});
getXlsPackingListFromBlob.mockImplementation(() => {
  return jest.fn();
});
findParser.mockImplementation(() => {
  return {
    parserModel: ParserModel.NISA1,
    business_checks: {
      all_required_fields_present: true,
    },
  };
});
createPackingList.mockImplementation(() => {
  return jest.fn();
});
patchPackingListCheck.mockImplementation(() => {
  return jest.fn();
});


MessageReceiver.mockImplementation(() => {
  return {
    subscribe: jest.fn(),
    deadLetterMessage: jest.fn(),
    completeMessage: jest.fn(),
    abandonMessage: jest.fn(),
  };
});

jest.mock("../../../app/config", () => {
  return {
    ...jest.requireActual("../../../app/config"),
    get isDynamicsIntegration() {
      return mockIsDynamicsIntegration;
    },
  };
});

let mockIsDynamicsIntegration = true;

describe("processPlpMessage", () => {
  let receiver;

  beforeEach(() => {
    jest.clearAllMocks();
    receiver = new MessageReceiver();
    MessageReceiver.mockImplementation(() => receiver);
  });

  afterEach(async () => {
    mockIsDynamicsIntegration = true;
  });

  test("should process a message", async () => {
    const message = {
      body: { packing_list_blob: "https://example.com/path/doesnt/matter" },
    };
    await messageAction(message, receiver);
    expect(receiver.completeMessage).toHaveBeenCalled();
  });

  test("handle error", async () => {
    const message = {
      body: {
        claimId: "claim123",
      },
    };
    receiver.completeMessage.mockImplementation(() => {
      throw new Error("Error");
    });
    await messageAction(message, receiver);
    expect(receiver.abandonMessage).toHaveBeenCalled();
  });
});
