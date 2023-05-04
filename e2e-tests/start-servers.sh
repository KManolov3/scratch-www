#!/bin/bash

gnome-terminal --title=react-native -- bash -c "cd ../../../app; npm start; exec bash -i"
gnome-terminal --title=mock-server -- bash -c "cd ../../../mock-server; npm start; exec bash -i"
gnome-terminal --title=appium-server -- bash -c "appium; exec bash -i"
gnome-terminal --title=virtual-device -- bash -c "emulator @$DEVICE_NAME; exec bash -i"