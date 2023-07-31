#!/bin/bash

source .env

ALL_DEVICES=($(emulator -list-avds))
export DEVICE_NAME=${ALL_DEVICES[0]}

if [[ $OS == "Linux" || $OS == "MacOS" ]]
then
  stop_servers="$(
      pkill -f -9 "cd ../app; npm start"
      pkill -f -9 "cd ../mock-server; npm start"
      pkill -f -9 "appium"
      pkill -f -9 "emulator @"
  )"
fi

if [[ $OS == "Windows" ]]
then
      TASKKILL //FI "WINDOWTITLE eq virtual-device" //F
      TASKKILL //FI "WINDOWTITLE eq react-native" //T //F
      TASKKILL //FI "WINDOWTITLE eq mock-server" //T //F
      TASKKILL //FI "WINDOWTITLE eq appium-server" //T //F
fi
