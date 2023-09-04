#!/usr/bin/env bash
# Script that tests all program data files against a schema.
# Can be run via `npm run test-data` (in backend workspace).

PROGRAMS_DATA_DIR=../web/public/data/programs
JSON_SCHEMA_FILE=data/program-data-schema.json

find "${PROGRAMS_DATA_DIR}" -type f -print0 | \
  xargs -0 -I {} -n1 npx ajv test --spec=draft2020 -s "${JSON_SCHEMA_FILE}" -d {}  --valid
