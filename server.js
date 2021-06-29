//Get All Dependencies
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const cron = require("node-cron");
const fetch = require("node-fetch");
dotenv.config();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

//Global Variable
var content;
var task;

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Matches "/stop"
bot.onText(/\/stop/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  task.stop();
  task = undefined;
  bot.sendMessage(chatId, "Notification sending Stoped"); 
});

// Matches "/notify_me [pincode]"
bot.onText(/\/notify_me (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "pincode"

  //Call COWIN API to check the slots
  //Fetch COWIn Data by PINCODE
  var requestOptions = {
    method: "GET",
    host: "cdn-api.co-vin.in",
    redirect: "follow",
  };
  if(typeof(task) == "undefined"){
    //schedule a job for every 10 sec
    task = cron.schedule("*/10 * * * * *", function () {
    const d = new Date();
    var date_filter = "";
    date_filter = date_filter + String(d.getDate()) + "-";
    date_filter = date_filter + String(d.getMonth() + 1) + "-";
    date_filter = date_filter + String(d.getFullYear());
    fetch(
      "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" +
        resp +
        "&date=" +
        date_filter,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        var records = 0;
        var xml_parse = JSON.parse(result);
        if (xml_parse.sessions.length == 0) {
          //console.log("Inside If");
          content = "No Slots Available Currently \n To stop receiving notifications send message /stop ";
          bot.sendMessage(chatId, content);
        } else {
          var range = xml_parse.sessions.length;
          for (var i = 0; i < range; i++) {
            if (xml_parse.sessions[i].available_capacity > 0) {
              records++;
              content = "Notification \n";
              content = content +
                "Dear Colleague, " +
                String(xml_parse.sessions[i].available_capacity) +
                " Doses Available";
              content = content + " Dose1: " + String(xml_parse.sessions[i].available_capacity_dose1);
              content = content + " Dose2: " + String(xml_parse.sessions[i].available_capacity_dose2);
              content = content + " Min Age Limit: " + String(xml_parse.sessions[i].min_age_limit);
              content = content + " Vaccine: " + String(xml_parse.sessions[i].vaccine);
              content = content + " Fee Type: " + String(xml_parse.sessions[i].fee_type);
              content = content + " in Center Id " + String(xml_parse.sessions[i].center_id);
              content = content + " Address " + String(xml_parse.sessions[i].name);
              content = content + " at " + String(xml_parse.sessions[i].address);
              content = content + " Pincode- " + String(xml_parse.sessions[i].pincode);
              // send back the matched "whatever" to the chat
              bot.sendMessage(chatId, content);
            }
          }
          if (records == 0) {
            content = "No Slots Available Currently \n To stop receiving notifications send message /stop";
            bot.sendMessage(chatId, content);
          }
          else{
            content = "\n To stop receiving notifications send message /stop";
            bot.sendMessage(chatId, content);
          }
        }
      })
      .catch((error) => console.log("error", error));
    });
  }else{
    bot.sendMessage(chatId, "Job is already running. Please wait for it to finish");
  }
});

// Matches "/start"
bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  var resp = "";
  resp = resp + "Hi there! I am S4_COVIDBOT Your Digital Assistant \n\n";
  resp = resp + "If you need urgent help you can also call the Central Covid Helpline number +91-11-23978046.";
  resp = resp + "\n\n 1) For Immediate assiatance click /help";
  resp = resp + "\n\n 2) To get Update on the Covid Availability send message /notify_me <Your Pincode> \n e.g /notify_me 411061 (Valid for 24 Hours) \n To stop receiving notifications send message /stop";
  resp = resp + "\n\n 3) To get latest Covid Availability nearby you send message /search_nearby";
  resp = resp + "\n\n 4) To get latest Covid Availability by PinCode send message /search_byPin <Your Pincode> \n e.g /search_byPin 411061";
  resp = resp + "\n\n 5) To get the location for Center send message /locate_center <center_code> \n e.g /locate_center 215";
  resp = resp + "\n\n 6) For future availability check-  https://www.cowin.gov.in/home \n\n";
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  let text = msg.text;
  if ((text && text.match(/\/start/)) || (text && text.match(/\/notify_me (.+)/)) || (text && text.match(/\/stop/))|| (text && text.match(/\/search_byPin (.+)/)) || (text && text.match(/\/search_nearby/)) || (text && text.match(/\/help/)) || (text && text.match(/\/locate_center (.+)/)) || (text && text.match(/\/echo (.+)/)))
    return;
  if (typeof(text) == "undefined")
    return;
  // send a message to the chat acknowledging receipt of their message
  var resp = "";
  resp = resp + "Sorry not understood \n\n";
  resp = resp + "If you need urgent help you can also call the Central Covid Helpline number +91-11-23978046";
  resp = resp + "\n\n 1) For Immediate assiatance click /help";
  resp = resp + "\n\n 2) To get Update on the Covid Availability send message /notify_me <Your Pincode> \n e.g /notify_me 411061 (Valid for 24 Hours) \n To stop receiving notifications send message /stop";
  resp = resp + "\n\n 3) To get latest Covid Availability nearby you send message /search_nearby";
  resp = resp + "\n\n 4) To get latest Covid Availability by PinCode send message /search_byPin <Your Pincode> \n e.g /search_byPin 411061";
  resp = resp + "\n\n 5) To get the location for Center send message /locate_center <center_code> \n e.g /locate_center 215";
  resp = resp + "\n\n 6) For future availability check-  https://www.cowin.gov.in/home";
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, resp);
  bot.sendMessage(chatId, "Have Good Day!");
});

// Matches "/search_nearby"
bot.onText(/^\/search_nearby/, function (msg, match) {
  var option = {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [
          {
            text: "My Location",
            request_location: true,
          },
        ],
        ["Cancel"],
      ],
    },
  };
  bot.sendMessage(msg.chat.id, "Please share your location? (Make Sure Location Sharing is on)", option);
});

// Matches "/help"
bot.onText(/^\/help/, function (msg, match) {
  var option = {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [
          {
            text: "My Contact",
            request_contact: true,
          },
        ],
        ["Cancel"],
      ],
    },
  };
  bot.sendMessage(msg.chat.id, "Please share your contact?", option);
});

// Trigger on Sharing Contact
bot.on("contact",(msg)=>{
  bot.sendMessage(msg.chat.id,"Thanks for sharing your contact detail " + msg.contact.phone_number + " . We will get back to you Immediately");    
});

//Trigger on Sharing Location
bot.on("location", (msg) => {
  const chatId = msg.chat.id;
  const d = new Date();
  var date_filter = "";
  date_filter = date_filter + String(d.getDate()) + "-";
  date_filter = date_filter + String(d.getMonth() + 1) + "-";
  date_filter = date_filter + String(d.getFullYear());
  var lat1 = msg.location.latitude;
  var long1 = msg.location.longitude;
  var lat2, long2;
  //Call COWIN API to check the slots
  //Fetch COWIn Data by PINCODE
  var requestOptions = {
    method: "GET",
    host: "cdn-api.co-vin.in",
    redirect: "follow",
  };
  var content = "";
  fetch(
    "https://cdn-api.co-vin.in/api/v2/appointment/centers/public/findByLatLong?lat=" +
      msg.location.latitude +
      "&long=" +
      msg.location.longitude,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      var records = 0;
      var xml_parse = JSON.parse(result);
      if (xml_parse.centers.length == 0) {
        content = "No NearBy Centers";
        bot.sendMessage(chatId, content);
      } else {
        var range = xml_parse.centers.length;
        lat1 = parseFloat(lat1) * Math.PI / 180;
        long1 = parseFloat(long1) * Math.PI / 180;
        for (var i = 0; i < range; i++) {
          lat2 = parseFloat(xml_parse.centers[i].lat) * Math.PI /180;
          long2 = parseFloat(xml_parse.centers[i].long) * Math.PI /180;
          lat1.toFixed(4);
          long1.toFixed(4);
          lat2.toFixed(4);
          long2.toFixed(4);
          // Haversine formula
          let dlon = long2 - long1;
          let dlat = lat2 - lat1;
          let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(lat1) * Math.cos(lat2)
                 * Math.pow(Math.sin(dlon / 2),2);
               
          let c = 2 * Math.asin(Math.sqrt(a));
   
          // Radius of earth in kilometers. Use 3956
          // for miles
          let r = 6371;
          if(c*r <= 5 ){
            fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id="+xml_parse.centers[i].center_id+"&date="+date_filter, requestOptions)
            .then(response => response.text())
            .then(result => {console.log(result);
              var xml_parse2 = JSON.parse(result);
              //var length_center = xml_parse2.centers.length;
              if(xml_parse2.centers.length != "undefined"){
                var range2 = xml_parse2.centers.sessions.length;
                for(var j=0; j<range2;j++){
                if(xml_parse2.centers.sessions[j].available_capacity > 0){  
                  content = "";
                  console.log(i);
                  content = content + xml_parse2.centers.sessions[j].available_capacity_dose1 + " Dose1 and ";
                  content = content + xml_parse2.centers.sessions[j].available_capacity_dose2 + " Dose2 available for ";
                  content = content + " Age Limit " + xml_parse2.centers.sessions[j].min_age_limit;
                  content = content + " Vaccine " + xml_parse2.centers.sessions[j].vaccine;
                  content = content + " Fee Type " + xml_parse2.centers.fee_type;
                  content = content + " For Date " + xml_parse2.centers.sessions[j].date;
                  content = content + " at Center ID: " + String(xml_parse2.centers.center_id);
                  content = content + " " + String(xml_parse2.centers.name) + " " + String(xml_parse2.centers.address);
                  content = content + " " + String(xml_parse2.centers.pincode) + " " + String(xml_parse2.centers.block_name);
                  content = content + " " + String(xml_parse2.centers.district_name) + " " + String(xml_parse2.centers.state_name);
                  content = content + " At distance of: " + String((c*r).toFixed(2)) + " KMs";
                  records++;  
                  bot.sendMessage(chatId, content);
                }
                }
              }
              if (records == 0) {
                content = "No Centers Available Currently";
                bot.sendMessage(chatId, content);
              }
            })
            .catch(error => console.log('error', error));
          }
        }
      }
    })
    .catch((error) => console.log("error", error));
});

// Matches "/search_byPin [pincode]"
bot.onText(/\/search_byPin (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "pincode"

  //Call COWIN API to check the slots
  //Fetch COWIn Data by PINCODE
  var requestOptions = {
    method: "GET",
    host: "cdn-api.co-vin.in",
    redirect: "follow",
  };
  const d = new Date();
  var date_filter = "";
  date_filter = date_filter + String(d.getDate()) + "-";
  date_filter = date_filter + String(d.getMonth() + 1) + "-";
  date_filter = date_filter + String(d.getFullYear());
  fetch(
    "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" +
      resp +
      "&date=" +
      date_filter,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      var records = 0;
      var xml_parse = JSON.parse(result);
      if (xml_parse.sessions.length == 0) {
        content = "No Slots Available Currently, Try /search_nearby";
        bot.sendMessage(chatId, content);
      } else {
        var range = xml_parse.sessions.length;
        for (var i = 0; i < range; i++) {
          if (xml_parse.sessions[i].available_capacity > 0) {
            records++;
            content =
              "Dear Colleague, " +
              String(xml_parse.sessions[i].available_capacity) +
              " Doses Available";
            content = content + " Dose1: " + String(xml_parse.sessions[i].available_capacity_dose1);
            content = content + " Dose2: " + String(xml_parse.sessions[i].available_capacity_dose2);
            content = content + " Min Age Limit: " + String(xml_parse.sessions[i].min_age_limit);
            content = content + " Vaccine: " + String(xml_parse.sessions[i].vaccine);
            content = content + " Fee Type: " + String(xml_parse.sessions[i].fee_type);
            content = content + " in Center Id " + String(xml_parse.sessions[i].center_id);
            content = content + " Address " + String(xml_parse.sessions[i].name);
            content = content + " at " + String(xml_parse.sessions[i].address);
            content = content + " Pincode- " + String(xml_parse.sessions[i].pincode);
            // send back the matched "whatever" to the chat
            bot.sendMessage(chatId, content);
          }
        }
        if (records == 0) {
          content = "No Slots Available Currently, Try /search_nearby";
          bot.sendMessage(chatId, content);
        }
      }
    })
    .catch((error) => console.log("error", error));
  //});
});

// Matches "/locate_center [center Id]"
bot.onText(/\/locate_center (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "center id"
  const d = new Date();
  var date_filter = "";
  date_filter = date_filter + String(d.getDate()) + "-";
  date_filter = date_filter + String(d.getMonth() + 1) + "-";
  date_filter = date_filter + String(d.getFullYear());
  //Fetch COWIn Data by Center Code
  var requestOptions = {
    method: "GET",
    host: "cdn-api.co-vin.in",
    redirect: "follow",
  }; 
  fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id="+ resp + "&date=" + date_filter, requestOptions)
  .then(response => response.text())
  .then(result => {console.log(result);
    var xml_parse = JSON.parse(result);
    bot.sendLocation(
              msg.chat.id,
              xml_parse.centers.lat,
              xml_parse.centers.long
            );
  })
  .catch(error => console.log('error', error));
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, "Location for Center Id: " + resp + " as per government data: ");
});

