#!/bin/bash

if [[ $# != 1 ]]; then
    echo "Usage: $0 <path-to-apk>"
    exit -1
fi

FILE="$1"

# Zebra 51
adb connect android-cd10b973b49f01ba.astea:5555
adb -s android-cd10b973b49f01ba.astea:5555 install -r "$FILE"

# Zebra 57
adb connect android-198189821c23a8b2.astea:5555
adb -s android-198189821c23a8b2.astea:5555 install -r "$FILE"
