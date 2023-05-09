#!/bin/bash

source .env

ALL_DEVICES=($(emulator -list-avds))
export DEVICE_NAME=${ALL_DEVICES[0]}

  start_servers() {
    $(
      $1 -t 'react-native' 'cd ../app; npm start' && 
      $1 -t 'mock-server' 'cd ../mock-server; npm start' &&
      $1 -t 'appium-server' 'appium' &&
      $1 -t 'virtual-device' 'emulator @'$DEVICE_NAME''
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


