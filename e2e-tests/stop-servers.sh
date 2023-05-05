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
  stop_servers="$(
    Stop-Process -Name "cd ../app; npm start" -Force
    Stop-Process -Name "cd ../mock-server; npm start" -Force
    Stop-Process -Name "appium" -Force
    Stop-Process -Name "emulator @" -Force
  )"
fi


