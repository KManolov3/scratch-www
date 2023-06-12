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
  wt --title virtual-device -- emulator -avd $DEVICE_NAME
  wt --title react-native --suppressApplicationTitle -d ~/**/in-store-mobile-app/app -- npm.cmd start
  wt --title mock-server --suppressApplicationTitle -d ~/**/in-store-mobile-app/mock-server -- npm.cmd start
  wt --title appium-server --suppressApplicationTitle -d ~/**/in-store-mobile-app/e2e-tests -- npm.cmd run appium
fi

# waiting the emulator to start
sleep 5

cd ../app && npm run adb:reverse
cd ../e2e-tests
