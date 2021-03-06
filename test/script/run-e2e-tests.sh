#!/bin/bash

# Move to the Protractor test project folder
cd $HOME

cd ccd-case-management-web

# X11 for Ubuntu is not configured! The following configurations are needed for XVFB.
# Make a new display :21 with virtual screen 0 with resolution 1024x768 24dpi
Xvfb :10 -screen 0 1920x1080x24 2>&1 >/dev/null &
# Export the previously created display
# export DISPLAY=:10.0

# Right now this is not necessary, because of 'directConnect: true' in the 'e2e.conf.js'
#echo "Starting webdriver"
#node ./node_modules/protractor/bin/webdriver-manager start [OR webdriver-manager start] &
#echo "Finished starting webdriver"

echo "Running Protractor tests"
# The 'uluwatu-e2e-protractor' test project launch configuration file (e2e.conf.js) should be passed here.
DISPLAY=:10 yarn $@
export RESULT=$?

echo "Protractor tests have done"
# Close the XVFB display
killall Xvfb

exit $RESULT
