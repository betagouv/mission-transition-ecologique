#!/usr/bin/env bash
# Script that tests all program data files against a schema.
# Do not run manually, use `npm run test-data` instead (in backend workspace).

find ../web/public/data/programs -type f -print0 | xargs -0 -I {} -n1 ajv test --spec=draft2020 -s data/program-data-schema.json -d {}  --valid
