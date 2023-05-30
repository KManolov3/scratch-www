#!/bin/bash

source .env

ALL_DEVICES=($(emulator -list-avds))
export DEVICE_NAME=${ALL_DEVICES[0]}

  start_servers() {
    $(
      $1 -t 'virtual-device' 'emulator @'$DEVICE_NAME'' &&
      $1 -t 'react-native' 'cd ../app; npm start' && 
      $1 -t 'mock-server' 'cd ../mock-server; npm start' &&
      $1 -t 'appium-server' 'npm run appium'
    )
  }

if [[ $OS == "Linux" || $OS == "MacOS" ]]
then
  start_servers ttab
fi

if [[ $OS == "Windows" ]]
then
  start_servers wttab
fi

# waiting the emulator to start
sleep 2

cd ../app && npm run adb:reverse
cd ../e2e-tests
