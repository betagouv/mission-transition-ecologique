#!/usr/bin/env bash
# Script that tests all program data files against a schema.
# Can be run via `npm run test-data` (in backend workspace).

find ../web/public/data/programs -type f -print0 | xargs -0 -I {} -n1 npx ajv test --spec=draft2020 -s data/program-data-schema.json -d {}  --valid
