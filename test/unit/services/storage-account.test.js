const {
  createStorageAccountClient,
  getPackingListFromBlob,
} = require("../../../app/services/storage-account");

// Mock external dependencies
jest.mock("../../../app/utilities/excel-utility");
jest.mock("../../../app/utilities/csv-utility");
jest.mock("@azure/storage-blob");
jest.mock("@azure/identity");
jest.mock("../../../app/utilities/logger");
jest.mock("../../../app/utilities/file-extension");

const { convertExcelToJson } = require("../../../app/utilities/excel-utility");
const { convertCsvToJson } = require("../../../app/utilities/csv-utility");
const { BlobClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const logger = require("../../../app/utilities/logger");
const { isExcel, isCsv } = require("../../../app/utilities/file-extension");

describe("storage-account", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createStorageAccountClient", () => {
    it("should create a BlobClient with the provided URI and DefaultAzureCredential", () => {
      const mockBlobUri =
        "https://storage.blob.core.windows.net/container/blob.xlsx";
      const mockCredential = {};
      const mockBlobClient = {};

      DefaultAzureCredential.mockImplementation(() => mockCredential);
      BlobClient.mockImplementation(() => mockBlobClient);

      const result = createStorageAccountClient(mockBlobUri);

      expect(DefaultAzureCredential).toHaveBeenCalledTimes(1);
      expect(BlobClient).toHaveBeenCalledWith(mockBlobUri, mockCredential);
      expect(result).toBe(mockBlobClient);
    });

    it("should create a new instance each time it is called", () => {
      const mockBlobUri1 =
        "https://storage.blob.core.windows.net/container/blob1.xlsx";
      const mockBlobUri2 =
        "https://storage.blob.core.windows.net/container/blob2.csv";

      BlobClient.mockImplementation(() => ({}));

      createStorageAccountClient(mockBlobUri1);
      createStorageAccountClient(mockBlobUri2);

      expect(BlobClient).toHaveBeenCalledTimes(2);
      expect(BlobClient).toHaveBeenNthCalledWith(
        1,
        mockBlobUri1,
        expect.any(Object),
      );
      expect(BlobClient).toHaveBeenNthCalledWith(
        2,
        mockBlobUri2,
        expect.any(Object),
      );
    });
  });

  describe("getPackingListFromBlob", () => {
    let mockBlobClient;

    beforeEach(() => {
      mockBlobClient = {
        download: jest.fn(),
      };
    });

    // Helper function to create a mock stream
    const createMockStream = (
      chunks = [],
      shouldError = false,
      errorType = "error",
    ) => {
      const mockStream = {
        on: jest.fn((event, callback) => {
          if (event === "data") {
            chunks.forEach((chunk) => {
              setImmediate(() => callback(chunk));
            });
          } else if (event === "end") {
            setImmediate(() => callback());
          } else if (event === "error" && shouldError) {
            setImmediate(() => callback(new Error("Stream error")));
          }
          return mockStream;
        }),
      };
      return mockStream;
    };

    describe("successful file processing", () => {
      it("should process Excel files correctly", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.xlsx";
        const mockBuffer = Buffer.from("excel data");
        const mockConvertedData = { Sheet1: [{ data: "converted" }] };

        const mockStream = createMockStream([mockBuffer]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(true);
        isCsv.mockReturnValue(false);
        convertExcelToJson.mockReturnValue(mockConvertedData);

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(mockBlobClient.download).toHaveBeenCalledTimes(1);
        expect(isExcel).toHaveBeenCalledWith(mockBlobUri);
        expect(convertExcelToJson).toHaveBeenCalledWith({ source: mockBuffer });
        expect(result).toBe(mockConvertedData);
      });

      it("should process CSV files correctly", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.csv";
        const mockBuffer = Buffer.from("csv,data\n1,2");
        const mockConvertedData = [{ csv: "1", data: "2" }];

        const mockStream = createMockStream([mockBuffer]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(false);
        isCsv.mockReturnValue(true);
        convertCsvToJson.mockResolvedValue(mockConvertedData);

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(mockBlobClient.download).toHaveBeenCalledTimes(1);
        expect(isCsv).toHaveBeenCalledWith(mockBlobUri);
        expect(convertCsvToJson).toHaveBeenCalledWith(mockBuffer);
        expect(result).toBe(mockConvertedData);
      });

      it("should return raw buffer for unsupported file types", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.txt";
        const mockBuffer = Buffer.from("raw text data");

        const mockStream = createMockStream([mockBuffer]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(false);
        isCsv.mockReturnValue(false);

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(mockBlobClient.download).toHaveBeenCalledTimes(1);
        expect(isExcel).toHaveBeenCalledWith(mockBlobUri);
        expect(isCsv).toHaveBeenCalledWith(mockBlobUri);
        expect(convertExcelToJson).not.toHaveBeenCalled();
        expect(convertCsvToJson).not.toHaveBeenCalled();
        expect(result).toEqual(mockBuffer);
      });

      it("should handle multiple data chunks in stream", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.xlsx";
        const mockChunk1 = Buffer.from("chunk1");
        const mockChunk2 = Buffer.from("chunk2");
        const mockConvertedData = { Sheet1: [{ data: "converted" }] };

        const mockStream = createMockStream([mockChunk1, mockChunk2]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(true);
        isCsv.mockReturnValue(false);
        convertExcelToJson.mockReturnValue(mockConvertedData);

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(convertExcelToJson).toHaveBeenCalledWith({
          source: Buffer.concat([mockChunk1, mockChunk2]),
        });
        expect(result).toBe(mockConvertedData);
      });

      it("should handle Buffer and non-Buffer data chunks", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.csv";
        const mockStringData = "string data";
        const mockBufferData = Buffer.from("buffer data");
        const mockConvertedData = [{ data: "converted" }];

        const mockStream = createMockStream([mockStringData, mockBufferData]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(false);
        isCsv.mockReturnValue(true);
        convertCsvToJson.mockResolvedValue(mockConvertedData);

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(convertCsvToJson).toHaveBeenCalledWith(
          Buffer.concat([Buffer.from(mockStringData), mockBufferData]),
        );
        expect(result).toBe(mockConvertedData);
      });
    });

    describe("error handling", () => {
      it("should handle blob download errors and return empty object", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.xlsx";
        const downloadError = new Error("Download failed");

        mockBlobClient.download.mockRejectedValue(downloadError);

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(logger.logError).toHaveBeenCalledWith(
          expect.stringContaining("storage-account.js"),
          "getPackingListFromBlob()",
          downloadError,
        );
        expect(result).toEqual({});
      });

      it("should handle stream errors properly", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.xlsx";

        // Create a stream that immediately errors
        const mockStream = {
          on: jest.fn((event, callback) => {
            if (event === "error") {
              setImmediate(() => callback(new Error("Stream error")));
            }
            return mockStream;
          }),
        };

        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        // The function should still complete but log an error
        expect(logger.logError).toHaveBeenCalledWith(
          expect.stringContaining("storage-account.js"),
          "streamToBuffer()",
          expect.any(Error),
        );
        // Since streamToBuffer returns undefined on error, and convertExcelToJson
        // might handle undefined input differently, we just check that it doesn't throw
        expect(result).toBeDefined();
      });

      it("should handle conversion errors gracefully", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.xlsx";
        const mockBuffer = Buffer.from("excel data");
        const conversionError = new Error("Conversion failed");

        const mockStream = createMockStream([mockBuffer]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(true);
        isCsv.mockReturnValue(false);
        convertExcelToJson.mockImplementation(() => {
          throw conversionError;
        });

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(logger.logError).toHaveBeenCalledWith(
          expect.stringContaining("storage-account.js"),
          "getPackingListFromBlob()",
          conversionError,
        );
        expect(result).toEqual({});
      });

      it("should handle CSV conversion errors gracefully", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.csv";
        const mockBuffer = Buffer.from("csv data");
        const conversionError = new Error("CSV conversion failed");

        const mockStream = createMockStream([mockBuffer]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(false);
        isCsv.mockReturnValue(true);
        convertCsvToJson.mockRejectedValue(conversionError);

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(logger.logError).toHaveBeenCalledWith(
          expect.stringContaining("storage-account.js"),
          "getPackingListFromBlob()",
          conversionError,
        );
        expect(result).toEqual({});
      });
    });

    describe("edge cases", () => {
      it("should handle empty streams", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.xlsx";

        const mockStream = createMockStream([]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(true);
        isCsv.mockReturnValue(false);
        convertExcelToJson.mockReturnValue({ Sheet1: [] });

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(convertExcelToJson).toHaveBeenCalledWith({
          source: Buffer.alloc(0),
        });
        expect(result).toEqual({ Sheet1: [] });
      });

      it("should handle null/undefined blob URI", async () => {
        const mockBuffer = Buffer.from("data");

        const mockStream = createMockStream([mockBuffer]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(false);
        isCsv.mockReturnValue(false);

        const result = await getPackingListFromBlob(mockBlobClient, null);

        expect(isExcel).toHaveBeenCalledWith(null);
        expect(isCsv).toHaveBeenCalledWith(null);
        expect(result).toEqual(mockBuffer);
      });

      it("should handle very large files by processing in chunks", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/large.xlsx";
        const largeChunks = Array.from({ length: 10 }, (_, i) =>
          Buffer.from(`chunk${i}`.repeat(100)),
        );
        const mockConvertedData = {
          Sheet1: [{ data: "large file converted" }],
        };

        const mockStream = createMockStream(largeChunks);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(true);
        isCsv.mockReturnValue(false);
        convertExcelToJson.mockReturnValue(mockConvertedData);

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(convertExcelToJson).toHaveBeenCalledWith({
          source: Buffer.concat(largeChunks),
        });
        expect(result).toBe(mockConvertedData);
      });
    });

    describe("file type detection", () => {
      it("should call isExcel before isCsv for file type detection", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.unknown";
        const mockBuffer = Buffer.from("data");

        const mockStream = createMockStream([mockBuffer]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(false);
        isCsv.mockReturnValue(false);

        await getPackingListFromBlob(mockBlobClient, mockBlobUri);

        // Check that both functions were called
        expect(isExcel).toHaveBeenCalledWith(mockBlobUri);
        expect(isCsv).toHaveBeenCalledWith(mockBlobUri);

        // Verify order by checking call indices
        const isExcelCallOrder = isExcel.mock.invocationCallOrder[0];
        const isCsvCallOrder = isCsv.mock.invocationCallOrder[0];
        expect(isExcelCallOrder).toBeLessThan(isCsvCallOrder);
      });

      it("should prioritize Excel detection over CSV when both return true", async () => {
        const mockBlobUri =
          "https://storage.blob.core.windows.net/container/test.xlsx";
        const mockBuffer = Buffer.from("data");
        const mockExcelData = { Sheet1: [{ excel: "data" }] };

        const mockStream = createMockStream([mockBuffer]);
        mockBlobClient.download.mockResolvedValue({
          readableStreamBody: mockStream,
        });

        isExcel.mockReturnValue(true);
        isCsv.mockReturnValue(true); // Both return true
        convertExcelToJson.mockReturnValue(mockExcelData);

        const result = await getPackingListFromBlob(
          mockBlobClient,
          mockBlobUri,
        );

        expect(convertExcelToJson).toHaveBeenCalledWith({ source: mockBuffer });
        expect(convertCsvToJson).not.toHaveBeenCalled();
        expect(result).toBe(mockExcelData);
      });
    });
  });
});
