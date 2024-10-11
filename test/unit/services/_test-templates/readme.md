# Introduction

The intent of this folder and the contained sub-folders is to simplify and standardise the testing of each of the key areas of the Parser process.

## Process

Copy the 3 template files into the appropriate test directory for the new parser.

Update the paths to the files (VS Code may do this for you but please ensure the paths are correct).

Run the tests. Assuming the parser has not been written, they should fail. If the parser has been written, the tests should pass and all aspects that require testing will be complete.

## Additional Information

The testing approach for the parsers utilises a shared model file for each type of test as well as a shared test results file for each test.

This allows for easier, cleaner, and more focused tests as well as removes duplication of test data between the various tests.
