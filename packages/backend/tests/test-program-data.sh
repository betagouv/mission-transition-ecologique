#!/usr/bin/env bash
# Script that tests all program data files against a schema.
# Can be run via `npm run test-data` (in backend workspace).

PROGRAMS_DATA_DIR=../data/programs
JSON_SCHEMA_FILE=data/program-data-schema.json

# find options:
#  -print0 : use null delimiter, so that xargs -0 can loop on the array
# xargs options:
#  -I {}   : use {} as filename placeholder to be used by ajv with "-d {}"
#  -n1     : run the command on each single filename
# See [ajv documentation](https://ajv.js.org/guide/getting-started.html) for
# details on the command line validator.
find "${PROGRAMS_DATA_DIR}" -type f -print0 | \
  xargs -0 -I {} -n1 npx ajv test --spec=draft2020 -s "${JSON_SCHEMA_FILE}" -d {}  --valid
