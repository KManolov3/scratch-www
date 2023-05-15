#!/bin/bash

source ../../.env

GREEN="\e[32m"
WHITE="\e[0m"

WORK_DIR="$(pwd | grep -o '[^/]*$')"
ALL_DEVICES=($(emulator -list-avds))

export DEVICE_NAME=${ALL_DEVICES[0]}
export APP_ACTIVITY=$1
export TEST_SUITE="${2:-"*"}"
export REPORT_PATH="${REPORT_PATH:-"./reports"}"

if [[ $START_SERVERS == true ]]
then
  npm run start-all-servers
fi

echo -e "${GREEN}> Launching app: $APP_ACTIVITY${WHITE}"
echo  -e "${GREEN}> Used device: $DEVICE_NAME${WHITE}"

# waiting the emulator to start adb reverse
sleep 2

cd ../../../app && npm run adb:reverse

cd ../e2e-tests

npm run e2e -- --spec "./specs/$WORK_DIR/$TEST_SUITE.ts"

if [[ $STOP_SERVERS == true ]]
then
  npm run stop-all-servers
fi

