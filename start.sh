#!/bin/bash

set -e

if [ -z "$WORKSPACE" ] ; then
  >&2 echo "WORKSPACE environment variable should be set to indicate which workspace to start"
  exit 1
else
  npm run start --workspace "$WORKSPACE" || \
    >&2 echo "\"start\" script failed. Is WORKSPACE environment a valid workspace path?"
fi
