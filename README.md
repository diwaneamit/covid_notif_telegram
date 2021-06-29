<h1 align="center">Node.js Covid Notification Telegram Bot</h1>

<div align="center">

Telegram Bot for Covid Vaccine Notification [Telegram Bot API](https://core.telegram.org/bots/api).


[![Bot API](https://img.shields.io/badge/Bot%20API-v.5.2-00aced.svg?style=flat-square&logo=telegram)](https://core.telegram.org/bots/api)
[![npm package](https://img.shields.io/npm/v/node-telegram-bot-api?logo=npm&style=flat-square)](https://www.npmjs.org/package/node-telegram-bot-api)

[![https://telegram.me/node_telegram_bot_api](https://img.shields.io/badge/💬%20Telegram-Channel-blue.svg?style=flat-square)](https://telegram.me/S4_CovidBOT)

</div>

### Features
Some Unique features for this BOT are:

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/Telegram%20Bot%20Features.jpg)

### Welcome message on default command

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/start_command.JPG)

### Feature 1- One Touch Help

Can be used to quickly connect to helpdesk by sharing your contact details:

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/help.gif)

The registered contact number on telegram will be shared after you accept on the prompted options.

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/help.jpg)

### Feature 2- Notification Update by PinCode

This feature is useful for the end user to get automated notification for the COVID Vaccine availability based on the Pin code they wants

Enduser can stop receiving notification by sending message /stop

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/notify_me.gif)

### Feature 3- Find near by vaccination center

This feature is useful to easily locate Vaccination centres near by end user location. They will get the complete details about
Vaccination Centre with Approx. distance in KM. Currently I am showing Centres in Range of 5 KM from the shared live location.

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/search_nearby.gif)

### Feature 4- Find vaccination center by Pin Code

This feature will help to get the available vaccination slots for a specific pincode

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/search_byPin.gif)

### Feature 5- Get Direction to Vaccination Center

It will help end user to check for directions to the centre from there location. The location is provided based on the coordinates given by Indian Government COWIN
API

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/locate_center.JPG)

## Install

```sh
npm i covid_notif_telegram
```

## Create your Own Bot

To create a new BOT you need to search for @BotFather in the Telegram App and send the command '/newbot'. Choose a name and user name for your bot. It will create a new bot for you and assign you a Token ID.

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/botfather.jpg)

Create an .env file in your folder and pass the assigned token id to the variable TOKEN

![](https://github.com/diwaneamit/covid_notif_telegram/blob/main/images/env%20file.jpg)


We can also deploy this bot on SAP BTP Cloud:
[Deploy Your Node.js App with the Cloud Foundry CLI](https://developers.sap.com/tutorials/cp-node-deploy-cf-cli.html "Deploy Your Node.js App with the Cloud Foundry CLI")
Note: SAP BTP servers are located for Europe and US region hence API calls to COWIN server will fail from SAP BTP due to restriction by Indian government.


