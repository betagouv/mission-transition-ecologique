# DATA FOLDER FOR TEE PROJECT

This workspace aims to be a space where we could store the raw data (as yaml files) and make basic operations on these primary data, such as build a json file compiling every yaml file.

## Install dependencies

```sh
# From this folder
nvm use
npm install
```

Or

```sh
# From root folder
nvm use
npm install --workspace packages/data
```

## Run the scripts

### Test program files

To run the test just run :

```sh
# Either from this package or from root level
npm run test-data
```

### Build JSON output

The program type is firsthand generated from the json schema (cf `./src/generateProgramType.ts`).

The original yaml files are by design incomplete. The content of `./common/constants.yaml` is appendend to each program's `publicodes` property. The data is then consolidated into `../web/public/data/generated/dataset_out.json`

```sh
# From this folder
npm run build-front-json-output
npm run build-front-json-output-watch
```
