#!/bin/bash

GREEN="\e[32m"
WHITE="\e[0m"

WORK_DIR="$(pwd | grep -o '[^/]*$')"
ALL_DEVICES=($(emulator -list-avds))

export DEVICE_NAME=${ALL_DEVICES[0]}
export APP_ACTIVITY=$1
export TEST_SUITE="${2:-"*"}"
export REPORT_PATH="${REPORT_PATH:-"./reports"}"

npm run e2e -- --spec "./specs/$WORK_DIR/$TEST_SUITE.ts"