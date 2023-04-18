#!/bin/bash

GREEN="\e[32m"
WHITE="\e[0m"

WORK_DIR=$(pwd | grep -o '[^/]*$')
ALL_DEVICES=($(emulator -list-avds))
export DEVICE_NAME=${ALL_DEVICES[0]}
export APP_ACTIVITY=$1
export TEST_SUITE=${2:-"*"}

if [[ 
  "$APP_ACTIVITY" == "CycleCountActivity" ||
  "$APP_ACTIVITY" == "ItemLookupActivity" ||
  "$APP_ACTIVITY" == "TruckDetailScanActivity"
  ]]
then
  echo -e "${GREEN}> Launching app: $APP_ACTIVITY${WHITE}"
  echo  -e "${GREEN}> Used device: $DEVICE_NAME${WHITE}"

  if [[ "$TEST_SUITE" == "*" ]]
  then 
    npm run e2e -- --spec "./specs/$WORK_DIR/*.ts"
  else 
    npm run e2e -- --spec "./specs/$WORK_DIR/$2.ts"
  fi

else
  echo "> Error: Wrong value for app activity!"
  echo "> Please use one of: CycleCountActivity | ItemLookupActivity | TruckDetailScanActivity"
fi