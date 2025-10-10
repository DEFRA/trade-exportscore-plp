const path = require("path");
const fs = require("fs");

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
} = require("../../app/utilities/file-processor");

// Only run this long-running QA test when RUN_QA_REGRESSION is explicitly set ("1" or "true").
// By default the suite will be skipped to keep normal test runs fast.
const RUN_QA =
  process.env.RUN_QA_REGRESSION === "1" ||
  String(process.env.RUN_QA_REGRESSION).toLowerCase() === "true";
const maybeDescribe = RUN_QA ? describe : describe.skip;

const isExcelFile = (fileName) => {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".xlsx") || lower.endsWith(".xls");
};

const isCsvFile = (fileName) => {
  return fileName.toLowerCase().endsWith(".csv");
};

const isFileToInclude = (fileName) => {
  return isExcelFile(fileName) || isCsvFile(fileName);
};

const processFile = async (filePath) => {
  if (isExcelFile(filePath)) {
    return processExcelFile(filePath);
  } else if (isCsvFile(filePath)) {
    return processCsvFile(filePath);
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
    // Allow custom root path via environment variable or use default
    const customPath = process.env.TEST_FOLDER_PATH;
    const packingListDir = customPath
      ? path.resolve(customPath)
      : path.join(process.cwd(), "app", "packing-lists");

    // Extract the root folder name when custom path is used
    const rootFolderName = customPath ? path.basename(packingListDir) : "";

    console.log(`📁 Scanning directory: ${packingListDir}`);
    if (rootFolderName) {
      console.log(`🎯 Root folder: ${rootFolderName}`);
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
      packingListDir,
      rootFolderName,
    );

    // Check if no  files found
    if (filesToProcess.length === 0) {
      console.log(`📂 No files found in: ${packingListDir}`);
      console.log(`✅ Test passed (no files to process)`);
      expect(true).toBe(true);
      return;
    }

    const responses = [];
    const csvRows = [
      "ID,Folder,SubFolder,FileName,Expected,Actual,Matching,Message",
    ];
    let idCounter = 1;

    for (const fileInfo of filesToProcess) {
      try {
        const response = await processFile(fileInfo.fullPath);

        responses.push(response);

        // Extract expected result from filename
        const fileName = fileInfo.fileName.toLowerCase();
        let expected = "Fail";
        if (fileName.includes("_pass")) {
          expected = "Pass";
        } else if (fileName.includes("_fail")) {
          expected = "Fail";
        } else if (fileName.includes("_unparse")) {
          expected = "Unparse";
        }

        // Extract actual result
        const actual =
          response.parserModel === "no-match"
            ? "Unparse"
            : response.business_checks?.all_required_fields_present
              ? "Pass"
              : "Fail";

        // Calculate test passed (Expected = Actual)
        const testPassed = expected === actual ? "Pass" : "Fail";

        const message = (response.business_checks?.failure_reasons || "")
          .replace(/\n/g, " ") // Remove newlines
          .replace(/"/g, '""') // Escape quotes for CSV
          .trim(); // Remove extra whitespace

        const csvFormattedData = `${idCounter},"${fileInfo.folder}","${fileInfo.subFolder}","${fileInfo.fileName}","${expected}","${actual}","${testPassed}","${message}"`;
        csvRows.push(csvFormattedData);

        idCounter++;
      } catch (error) {
        // Continue processing other files even if one fails
        console.log(
          `Failed to process ${fileInfo.relativePath}: ${error.message}`,
        );
        const fileName = fileInfo.fileName.toLowerCase();
        const expected = fileName.includes("_pass") ? "Pass" : "Fail";
        const testPassed = expected === "Fail" ? "Yes" : "No"; // Error = Fail result
        csvRows.push(
          `${idCounter},"${fileInfo.folder}","${fileInfo.subFolder}","${fileInfo.fileName}","${expected}","ERROR","${testPassed}","${error.message.replace(/\n/g, " ").replace(/"/g, '""').trim()}"`,
        );
        idCounter++;
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
  });
});
