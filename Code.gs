function getEnvironment() {
 var environment = {
   spreadsheetID: "1hVHK3Y348fs6TvrIfJnC2r5FcwO4xhL27dfE9F7O2ng",
   firebaseUrl: "https://hp-car-list-default-rtdb.asia-southeast1.firebasedatabase.app"
 };
 return environment;
}

function assign(obj, keyPath, value) {
 lastKeyIndex = keyPath.length - 1;
 for (var i = 0; i < lastKeyIndex; ++i) {
   key = keyPath[i];
   if (!(key in obj)) obj[key] = {};
   obj = obj[key];
 }
 obj[keyPath[lastKeyIndex]] = ZgUniConverter.getConvertedValue('zaw','uni',true,value);
}

function writeDataToFirebase() {
  var ss = SpreadsheetApp.openById(getEnvironment().spreadsheetID);
  var sheet = ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var dataToImport = {};
  for (var i = 1; i < data.length; i++) {
      dataToImport[data[i][0]] = {};
      for (var j = 0; j < data[0].length; j++) {
        assign(dataToImport[data[i][0]], data[0][j].split("__"), data[i][j]);
      }
  }
  var firebaseUrl = getEnvironment().firebaseUrl;
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl);
  base.setData("cars", dataToImport);
}
// Creates a Google Sheets on change trigger for the specific sheet
function createSpreadsheetEditTrigger() {
 var triggers = ScriptApp.getProjectTriggers();
 var triggerExists = false;
 for (var i = 0; i < triggers.length; i++) {
   if (triggers[i].getTriggerSourceId() == getEnvironment().spreadsheetID) {
     triggerExists = true;
     break;
   }
 }
if (!triggerExists) {
   var spreadsheet = SpreadsheetApp.openById(getEnvironment().spreadsheetID);
   ScriptApp.newTrigger("writeDataToFirebase")
     .forSpreadsheet(spreadsheet)
     .onChange()
     .create();
 }
}
// Delete all the existing triggers for the project
function deleteTriggers() {
 var triggers = ScriptApp.getProjectTriggers();
 for (var i = 0; i < triggers.length; i++) {
   ScriptApp.deleteTrigger(triggers[i]);
 }
}