#!/bin/bash

source .env

ALL_DEVICES=($(emulator -list-avds))
export DEVICE_NAME=${ALL_DEVICES[0]}

if [[ $OS == "Linux" || $OS == "MacOS" ]]
then
  start_servers="$(
    ttab -t 'react-native' 'cd ../app; npm start' && 
    ttab -t 'mock-server' 'cd ../mock-server; npm start' &&
    ttab -t 'appium-server' 'appium' &&
    ttab -t 'virtual-device' 'emulator @'$DEVICE_NAME''
  )"
fi

if [[ $OS == "Windows" ]]
then
  start_servers="$(
    wttab -t 'react-native' 'cd ../app; npm start' && 
    wttab -t 'mock-server' 'cd ../mock-server; npm start' &&
    wttab -t 'appium-server' 'appium' &&
    wttab -t 'virtual-device' 'emulator @'$DEVICE_NAME''
  )"
fi


