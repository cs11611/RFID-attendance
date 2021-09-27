const { google } = require("googleapis");
let privatekey = require("./credentials_rfid1.json");
// configure a JWT auth client
let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/calendar",
  ]
);
//authenticate request
jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});

//Google Sheets API
let spreadsheetId = "1yFb4oTvhW1t8FRsNIJardMgjrsO8rSo_LPHBpiK3QUE";
let sheetName = "Person DB!A1:B15";
let sheets = google.sheets("v4");
sheets.spreadsheets.values.get(
  {
    auth: jwtClient,
    spreadsheetId: spreadsheetId,
    range: sheetName,
  },
  function (err, response) {
    if (err) {
      console.log("The API returned an error: " + err);
    } else {
      console.log(`YAY!: ${JSON.stringify(response.data.values)}`);
    }
  }
);

function getDB() {
  console.log("hi");
}

module.exports = { getDB };
