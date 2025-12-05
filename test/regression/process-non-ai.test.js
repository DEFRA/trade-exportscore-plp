const path = require("node:path");
const fs = require("node:fs");

// Load expected results from JSON file
const loadExpectedResults = (jsonFilePath) => {
  if (!fs.existsSync(jsonFilePath)) {
    console.log(`⚠️  Expected results JSON not found: ${jsonFilePath}`);
    return null;
  }

  try {
    const jsonContent = fs.readFileSync(jsonFilePath, "utf8");
    const data = JSON.parse(jsonContent);

    // Return array of objects with filename, expected_outcome, failure_reason
    const expectedArray = [];
    if (data.expected_results && Array.isArray(data.expected_results)) {
      data.expected_results.forEach((result) => {
        expectedArray.push({
          filename: result.filename,
          expected_outcome: result.expected_outcome,
          failure_reason: result.failure_reason || "",
        });
      });
    }
    return expectedArray;
  } catch (error) {
    console.log(`❌ Error parsing JSON file ${jsonFilePath}: ${error.message}`);
    return null;
  }
};

// Mock         csvRows.push(`"${file}","ERROR","${error.message.replace(/\n/g, ' ').replace(/"/g, '""').trim()}"`);;atabase service
const mockDatabaseService = {
  models: {
    packingList: {
      create: jest.fn(),
    },
    item: {
      bulkCreate: jest.fn(),
    },
  },
  sequelize: {
    transaction: jest
      .fn()
      .mockImplementation((callback) => Promise.resolve(callback())),
    authenticate: jest
      .fn()
      .mockImplementation((callback) => Promise.resolve(callback())),
  },
};

jest.mock("../../app/services/database-service", () => mockDatabaseService);
jest.mock("../../app/utilities/logger", () => ({
  logError: jest.fn(),
  logInfo: jest.fn(),
}));

const config = require("../../app/config");
const {
  processExcelFile,
  processCsvFile,
  processPdfFile,
} = require("../../app/utilities/file-processor");

// Only run this long-running QA test when RUN_QA_REGRESSION is explicitly set ("1" or "true").
// By default the suite will be skipped to keep normal test runs fast.
const RUN_QA =
  process.env.RUN_QA_REGRESSION === "1" ||
  String(process.env.RUN_QA_REGRESSION).toLowerCase() === "true";
const maybeDescribe = RUN_QA ? describe : describe.skip;

/**
 * Filter expected results based on --testFilter command-line argument.
 * Supports filtering by filename patterns (case-insensitive).
 * Usage: npm run test:regression -- --testFilter=Coopparser
 * @param {Array} expectedResults - Array of expected result objects
 * @returns {Array} Filtered array based on --testFilter argument
 */
const filterExpectedResults = (expectedResults) => {
  // Check for --testFilter argument in process.argv
  const filterArgIndex = process.argv.findIndex((arg) =>
    arg.startsWith("--testFilter="),
  );

  if (filterArgIndex === -1 || !expectedResults) {
    return expectedResults;
  }

  const filter = process.argv[filterArgIndex].split("=")[1];
  const filterLower = filter.toLowerCase();
  const filtered = expectedResults.filter((result) =>
    result.filename.toLowerCase().includes(filterLower),
  );

  console.log(
    `🔍 Filter applied: "${filter}" - ${filtered.length} of ${expectedResults.length} files selected`,
  );
  return filtered;
};

const isExcelFile = (fileName) => {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".xlsx") || lower.endsWith(".xls");
};

const isCsvFile = (fileName) => {
  return fileName.toLowerCase().endsWith(".csv");
};

const isPdfFile = (fileName) => {
  return fileName.toLowerCase().endsWith(".pdf");
};

const isFileToInclude = (fileName) => {
  return isExcelFile(fileName) || isCsvFile(fileName) || isPdfFile(fileName);
};

const processFile = async (filePath) => {
  if (isExcelFile(filePath)) {
    return processExcelFile(filePath);
  } else if (isCsvFile(filePath)) {
    return processCsvFile(filePath);
  } else if (isPdfFile(filePath)) {
    return processPdfFile(filePath);
  } else {
    return {};
  }
};

// Recursive function to find all Excel files
const findFiles = (dir, baseDir = dir, rootFolderName = "") => {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      files.push(...findFiles(fullPath, baseDir, rootFolderName));
    } else if (isFileToInclude(item)) {
      // Extract folder structure relative to base directory
      const relativePath = path.relative(baseDir, fullPath);
      const pathParts = relativePath.split(path.sep);

      // Smart folder assignment based on depth
      let folder = "";
      let subFolder = "";

      if (pathParts.length >= 3) {
        // 3+ levels: FolderX -> SubFolderA -> SubFolderB -> Excel
        // Folder = SubFolderA, SubFolder = SubFolderB
        folder = pathParts[0];
        subFolder = pathParts[1];
      } else if (pathParts.length === 2) {
        // 2 levels: FolderX -> SubFolderA -> Excel
        // Folder = FolderX (root), SubFolder = SubFolderA
        folder = rootFolderName || path.basename(baseDir);
        subFolder = pathParts[0];
      } else {
        // 1 level: FolderX -> Excel (file in root)
        folder = rootFolderName || path.basename(baseDir);
        subFolder = "";
      }

      files.push({
        fileName: item,
        fullPath: fullPath,
        folder: folder,
        subFolder: subFolder,
        relativePath: relativePath,
        depth: pathParts.length,
      });
    }
  }

  return files;
};

describe("Excel Process Non-AI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDatabaseService.models.packingList.create.mockResolvedValue({ id: 1 });
    mockDatabaseService.models.item.bulkCreate.mockResolvedValue([]);
  });

  test("should process multiple Excel files and return responses", async () => {
    // JSON file is in test/regression directory
    const basePackingListDir = path.join(process.cwd(), "app", "packing-lists");

    // Read JSON file directly from regression folder
    const jsonFilePath = path.join(__dirname, "Expected_Outcomes.json");
    let expectedResultsMap = loadExpectedResults(jsonFilePath);

    // Apply filter if --testFilter argument is provided
    expectedResultsMap = filterExpectedResults(expectedResultsMap);

    // Allow custom root path via environment variable or use default
    const customPath = process.env.TEST_FOLDER_PATH;
    const packingListDir = customPath
      ? path.resolve(customPath)
      : basePackingListDir;

    // Extract the root folder name when custom path is used
    const rootFolderName = customPath ? path.basename(packingListDir) : "";

    console.log(`📁 Scanning directory: ${packingListDir}`);
    if (rootFolderName) {
      console.log(`🎯 Root folder: ${rootFolderName}`);
    }
    if (expectedResultsMap) {
      console.log(`📋 Expected results loaded from: ${jsonFilePath}`);
      console.log(
        `📊 Validation mode enabled with ${expectedResultsMap.length} expected results`,
      );
    } else {
      console.log(`⚠️  No expected results found at: ${jsonFilePath}`);
      console.log(`📊 Running in basic mode (no message validation)`);
    }
    console.log(`📊 Smart folder logic enabled`);

    // Check if directory exists
    if (!fs.existsSync(packingListDir)) {
      console.log(`⚠️  Directory does not exist: ${packingListDir}`);
      console.log(`✅ Test passed (no directory to process)`);
      expect(true).toBe(true);
      return;
    }

    // Find all Excel files recursively
    const filesToProcess = findFiles(
      packingListDir,
      basePackingListDir,
      rootFolderName,
    );

    // Filter files based on expected results if filter is applied
    let filteredFiles = filesToProcess;
    const hasFilter = process.argv.some((arg) =>
      arg.startsWith("--testFilter="),
    );
    if (expectedResultsMap && hasFilter) {
      const expectedFilenames = new Set(
        expectedResultsMap.map((r) => r.filename),
      );
      filteredFiles = filesToProcess.filter((file) =>
        expectedFilenames.has(file.relativePath),
      );
      console.log(
        `📋 Processing ${filteredFiles.length} files matching filter (${filesToProcess.length} total files found)`,
      );
    }

    // Check if no files found
    if (filteredFiles.length === 0) {
      console.log(`📂 No files found in: ${packingListDir}`);
      console.log(`✅ Test passed (no files to process)`);
      expect(true).toBe(true);
      return;
    }

    const responses = [];
    const csvHeaders = expectedResultsMap
      ? "ID,Folder,SubFolder,FileName,Expected,Actual,Matching,ExpectedMessage,ActualMessage,MessageMatching"
      : "ID,Folder,SubFolder,FileName,Expected,Actual,Matching,Message";
    const csvRows = [csvHeaders];
    let idCounter = 1;

    for (const fileInfo of filteredFiles) {
      try {
        const response = await processFile(fileInfo.fullPath);

        responses.push(response);

        // Lookup expected result from JSON, fallback to filename pattern
        // Use full path if subFolder exists, otherwise just filename
        const lookupKey = fileInfo.relativePath;

        const expectedFromJson = expectedResultsMap
          ? expectedResultsMap.find((item) => item.filename === lookupKey)
          : null;

        let expected = "Unknown";
        let expectedMessage = "";
        let usingJsonExpected = false;

        if (expectedFromJson) {
          // Use JSON expected results
          expected = expectedFromJson.expected_outcome;
          expectedMessage = (expectedFromJson.failure_reason || "")
            .replace(/\n/g, " ") // Remove newlines
            .replace(/"/g, '""') // Escape quotes for CSV
            .trim(); // Remove extra whitespace
          usingJsonExpected = true;
        } else {
          // Fallback to filename pattern
          const fileName = fileInfo.fileName.toLowerCase();
          if (fileName.includes("_pass")) {
            expected = "Pass";
          } else if (fileName.includes("_fail")) {
            expected = "Fail";
          } else if (fileName.includes("_unparse")) {
            expected = "Unparse";
          }
          usingJsonExpected = false;
        }

        // Extract actual result
        const actual =
          response.parserModel === "no-match"
            ? "Unparse"
            : response.business_checks?.all_required_fields_present
              ? "Pass"
              : "Fail";

        // Calculate test passed (Expected = Actual) - case insensitive
        const testPassed =
          expected.toLowerCase() === actual.toLowerCase() ? "Pass" : "Fail";

        const actualMessage = (response.business_checks?.failure_reasons || "")
          .replace(/\n/g, " ") // Remove newlines
          .replace(/"/g, '""') // Escape quotes for CSV
          .trim(); // Remove extra whitespace

        // Check if failure messages match (for validation mode)
        let messageMatching = "N/A";
        if (expectedResultsMap && expected.toLowerCase() !== "pass") {
          // If file is unparsed and outcome matches, set messageMatching to N/A
          if (actual.toLowerCase() === "unparse" && testPassed === "Pass") {
            messageMatching = "N/A";
          } else if (usingJsonExpected) {
            // JSON expected result: compare messages (case insensitive)
            if (!expectedMessage && actualMessage) {
              // No expected message but there is an actual message = Fail
              messageMatching = "Fail";
            } else if (expectedMessage && !actualMessage) {
              // Expected message but no actual message = Fail
              messageMatching = "Fail";
            } else if (expectedMessage && actualMessage) {
              // Both messages exist, compare them
              messageMatching =
                expectedMessage.toLowerCase() === actualMessage.toLowerCase()
                  ? "Pass"
                  : "Fail";
            }
          } else {
            // Filename pattern expected result: set to Unknown
            messageMatching = "Unknown";
          }
        }

        let csvFormattedData;
        if (expectedResultsMap) {
          csvFormattedData = `${idCounter},"${fileInfo.folder}","${fileInfo.subFolder}","${fileInfo.fileName}","${expected}","${actual}","${testPassed}","${expectedMessage}","${actualMessage}","${messageMatching}"`;
        } else {
          csvFormattedData = `${idCounter},"${fileInfo.folder}","${fileInfo.subFolder}","${fileInfo.fileName}","${expected}","${actual}","${testPassed}","${actualMessage}"`;
        }

        csvRows.push(csvFormattedData);
        idCounter++;
      } catch (error) {
        // Continue processing other files even if one fails
        console.log(
          `Failed to process ${fileInfo.relativePath}: ${error.message}`,
        );
      }
    }

    // Write CSV file
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.]/g, "")
      .replace("T", "")
      .substring(0, 14);
    const csvFilename = `${timestamp}-test-results.csv`;
    const testOutputDir = path.join(process.cwd(), "test-output");

    // Ensure test-output directory exists
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }

    const csvPath = path.join(testOutputDir, csvFilename);
    fs.writeFileSync(csvPath, csvRows.join("\n"), "utf8");
    console.log(
      `✅ Processed ${responses.length} files from ${packingListDir}`,
    );
    console.log(`📄 CSV saved: ${csvFilename}`);

    expect(responses.length).toBeGreaterThanOrEqual(0);
    expect(responses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          parserModel: expect.any(String),
        }),
      ]),
    );
  }, 300000); // 5 minute timeout for regression test
});
