# DATA FOLDER FOR TEE PROJECT

This workspace is where we preprocess our data sources, offline and executed manually when needed, before they are used in our applications.

We are using this approach as a way to easily open our data. This is especially interesting when couping this approach with the use of [Publicodes](https://publi.codes/) which allows us to open in a comprehensive way the core logic of our app.

We generate 4 kind of data :

- json-schemas : they can be used to
- yamls :
- json :
- typescript types

### Build all outputs

### Data generation pipeline

The program type is firsthand generated from the json schema (cf `./src/generateProgramType.ts`).

The original yaml files are by design incomplete. The content of `./common/interface.yaml` is appendend to each program's `publicodes`
property. The data is then consolidated into
`../web/public/data/generated/dataset_out.json`

```sh
# From this folder
npm run build-json-output
npm run build-json-output-watch
```

### Test program files

To run the test :

```sh
# Either from this package
npm run test
# or from root level: npm run test-data
```
