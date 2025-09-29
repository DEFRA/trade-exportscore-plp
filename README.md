# trade-exportscore-plp

## Prerequisites

- Docker
- Docker Compose (installed when Docker Desktop is installed - no separate installation is required).

Optional:

- Kubernetes
- Helm

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

When using the Docker Compose files in development the local `app` folder will
be mounted on top of the `app` folder within the Docker container, hiding the CSS files that were generated during the Docker build. For the site to render correctly locally `npm run build` must be run on the host system.

By default, the start script will build (or rebuild) images so there will
rarely be a need to build images manually. However, this can be achieved
through the Docker Compose
[build](https://docs.docker.com/compose/reference/build/) command:

```text
# Build container images
docker-compose build
```

### Start

Use Docker Compose to run service locally.

- run migrations
  - `docker-compose -f docker-compose.migrate.yaml run --rm database-up`
- start
  - `docker-compose up`
- stop
  - `docker-compose down` or CTRL-C

To run the app not using Docker, e.g. for pdf parsing

- First setup environment variables for document intelligence
- `export FORM_RECOGNIZER_ENDPOINT="https://<DI_NAME>.cognitiveservices.azure.com/"`
- `export IS_DOCUMENT_INTLELLIGENCE_ENABLED="true"`
- Connect to OpenVPN
- Sign in using az login
- Start
  - `npm run start:watch`
- Stop
  - CTRL-C

## Test structure

The tests have been structured into subfolders of `./test` as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

### Running QA Regression Tests

This QA regression test scans a folder of packing-list Excel files and writes a CSV report to `test-output/`. The suite is long-running and skipped by default; only run it when you need a full QA scan.

Usage (minimal):

- (Optional) To specify a test folder (By default, tests point to `./app/packing-lists`):

```bash
export TEST_FOLDER_PATH=/path/to/your/plp/repo/app/packing-lists
```

- To run the QA suite:

```bash
make qa-test
```

Notes:

- `RUN_QA_REGRESSION` must be `1` or `true` (case-insensitive) for the suite to run; otherwise it is skipped.
- CSV output is saved as `test-output/<timestamp>-excel-test.csv`.
- If the target folder does not exist or contains no Excel files the test exits early and reports success.

### Passing files to the local app

From within VS Code, please start the local app (i.e. press 'F5').

Once running, in the brower of your choice, navigate to the following:

```text
http://localhost:3000/non-ai?filename={filename and path}
```

e.g.

```text
http://localhost:3000/non-ai?filename=240424-I6001%20DDICE017%20MAIN20DD.xlsx
```

To facilitate the above, you will need to create a local directory called `packing-lists` under the main `app` directory (it is excluded from Git and thus no files will be commited to the repository). Prior to running the test(s) for the first time, simply add the file(s) to the `packing-lists` directory.

In addition to the above, please refer to the [Additional Information](./additional-info.md) file for extensions that make running / debugging a single test easier than the above method.

#### Troubleshooting

If you receive the following error:

![Docker not found error](./readme-images/Screenshot%202024-07-25%20103846.png "Docker not found error")

please check docker is running. The message is _interesting_ but, more importantly, so far wrong...

### Debugging

After much _fun_, please refer to the [Debugging](./debugging.md) file for information on how (and where) to debug your tests.

## Branching Strategy

This repository uses a structured branching strategy to ensure clean, testable releases and priority-driven development.

- `main` — only branch deployed to TST/Pre/Prod environments
- `develop` — staging branch for completed features/bugs, merged in strict order
- `feature/<ticket-id>-<short-name>` — short-lived feature branches
- `bug/<ticket-id>-<short-name>` — short-lived bug branches
- `urgent/<ticket-id>-<desc>` — urgent fixes merged directly to `main`

## CI & CD Pipeline

This service uses the [ADP Common Pipelines](https://github.com/DEFRA/adp-pipeline-common) for Builds and Deployments.

### AppConfig - KeyVault References

If the application uses `keyvault references` in `appConfig.env.yaml`, please make sure the variable to be added to keyvault is created in ADO Library variable groups and the reference for the variable groups and variables are provided in `build.yaml` like below.

```text
variableGroups:
    - trade-exportscore-plp-snd1
    - trade-exportscore-plp-snd2
    - trade-exportscore-plp-snd3
variables:
    - trade-exportscore-plp-APPINSIGHTS-CONNECTIONSTRING
```

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
