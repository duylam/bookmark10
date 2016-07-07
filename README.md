# Introduction

A dead simple Node app for detecting motion on Raspberry and alerting on found movements

# How to build in local (OSX / Linux / Windows)

1. Install Node
1. Checkout source code and install dependencies (for building): `npm install`
1. Build the app: `npm run build`
1. See **Launching**

# Prepare on Raspberry

1. Install [ARM binary Node](https://nodejs.org/en/download/)
1. Update **npm** to latest: `npm install -g npm`

# Launching

This repo contains 02 small applications:

- **app** (`'src/app'`) runs on Raspberry
- **notifier** (`'src/notifier'`) runs on OSX (tested) / Linux / Windows

After the app is build (`build` folder created)

1. To run **app** on Raspberry
  - Copy `build` folder to Raspberry: `scp -r ./build/. <username>@<host>:<path>`
  - Remote to Raspberry (SSH), navigate to copied folder
    - Install dependencies: `npm install`
    - Run the app: `sudo env PATH=$PATH env P10_GPIO_MOTION_PIN=25 env P10_NOTIFIER_HOSTNAME=192.168.1.10 node ./app`
      - Accessing GPIO pin on Raspberry requires root privilege
      - Assume the plugged GPIO pin for motion sensor is `25` and the IP of machine running **notifier** is `192.168.1.10`

2. To run **notifier** on OSX (and others)
  - Copy build folder to remote machine
  - Remote to machine (SSH), navigate to copied folder
  - Install dependencies: `npm install`
  - Run the app: `node ./notifier`

# Environment variables

Check `'src/app/config.js'` and `'src/app/index.js'`

# How to run **app** at start up on Raspberry

There are many options for running programs at starting up (Upstart, SysV, etc.). Let's use a simple approach: [/etc/rc.local](https://www.raspberrypi.org/documentation/linux/usage/rc-local.md)

Basically, apppend below command line into `/etc/rd.local`

`P10_GPIO_MOTION_PIN=... P10_NOTIFIER_HOSTNAME=... /path/to/bin/node /path/to/app 2>/var/run/myapp.error &`
