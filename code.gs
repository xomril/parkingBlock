var spots = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("spots");
var log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log");
var subscribes = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("subscribes");
var SERVER_URL = '';

function test(){
  var obj = subscribes.getRange(18, 3).getValue();
  var name = subscribes.getRange(18, 2).getValue();
  var data = {
        'obj': obj,
        'payload': "Thanks for the pan-test, let me know if you found something nice"
      };
      var options = {
        'method' : 'POST',
        'contentType': 'application/json',
        'payload' : JSON.stringify(data)
      };
      
      UrlFetchApp.fetch('https://hasamti.herokuapp.com/sendNotification', options);
}

function testTable(){
  var table = {};
    var values = spots.getDataRange().getValues();
    for(var i=0; i < values.length; i++) {
      var phone = ""+values[i][2];
      if(phone!="" && phone[0]!='0') phone = '0' + phone;
      table[i] = {"spot": values[i][0], "name": values[i][1],"phone": phone};
    }  
     var JSONString = JSON.stringify(table);
    var JSONOutput = ContentService.createTextOutput(JSONString);
    JSONOutput.setMimeType(ContentService.MimeType.JSON);
 Logger.log(table)
}
function doGet(e) {
  if(e.parameter.get == "all") {
    var table = {};
    var values = spots.getDataRange().getValues();
    for(var i=0; i < values.length; i++) {
     var phone = values[i][2]
     if(phone == undefined) phone = "";
     if(phone!="" && phone[0] !="0") phone = '0' + phone;
      table[i] = {"spot": values[i][0], "name": values[i][1],"phone": phone};
    }  
     var JSONString = JSON.stringify(table);
    var JSONOutput = ContentService.createTextOutput(JSONString);
    JSONOutput.setMimeType(ContentService.MimeType.JSON);
 return JSONOutput
 
  }
}

function setSubscriber(phone, name, obj){
  var values = subscribes.getDataRange().getValues();
  var isNew = true;
  for(var i=0; i < values.length; i++) {
    if(values[i][0].toString() === phone.toString()) {
      subscribes.getRange(i+1, 3).setValue(obj)
      isNew = false;
      break;
    }
  }
  
  if(isNew){
    subscribes.insertRowAfter(1)
    subscribes.getRange(2, 1).setValue(phone)
    subscribes.getRange(2, 2).setValue(name)
    subscribes.getRange(2, 3).setValue(obj)
  }
}
function doPost(e) {
  
  log.insertRowAfter(1)
  log.getRange(2, 1).setValue( e.postData.contents)
  
  var json =  JSON.parse(e.postData.contents);
  if(json['subscribe']){
    setSubscriber(json['phone'], json['name'],json['subscribeObj'])
    
  } else {
    var spot =  json['spot'];
    var name =  json['name'];
    var phone =  json['phone'];
    log.getRange(2, 2).setValue( spot)
    log.getRange(2, 3).setValue( name)
    log.getRange(2, 3).setValue( phone)
    setNameOnSpot(spot, name, phone)
  }
  var JSONString = JSON.stringify({result: "success"});
  var JSONOutput = ContentService.createTextOutput(JSONString);
    JSONOutput.setMimeType(ContentService.MimeType.JSON);
 return JSONOutput
}

function sendNotification(name, phone, text){
  var values = subscribes.getDataRange().getValues();
  for(var i=0; i< values.length;i++){
    if(values[i][0] == phone && values[i][1] == name){
      var data = {
        'obj': values[i][2],
        'payload': text
      };
      var options = {
        'method' : 'POST',
        'contentType': 'application/json',
        // Convert the JavaScript object to a JSON string.
        'payload' : JSON.stringify(data)
      };
      
      UrlFetchApp.fetch(SERVER_URL + '/sendNotification', options);
    }
  }
}

function setNameOnSpot(spot, name, phone){
  var values = spots.getDataRange().getValues();
  for(var i=0; i< values.length; i++){
      if(values[i][1] == name && values[i][2] == phone){
        spots.getRange(i+1, 2).setValue("");
        spots.getRange(i+1, 3).setValue("")
      }
    }
  
  if(spot.indexOf('b') > -1 && name !=""){
    for(var i=0; i< values.length; i++){
      if(values[i][0] == spot.replace('b','')){
        sendNotification(spots.getRange(i+1, 2).getValue(), spots.getRange(i+1, 3).getValue(),"נחסמת על ידי " + name);
        break;
      }
    }
  }
  
  for(var i=0; i < values.length; i++) {
    if(values[i][0].toString() === spot.toString()) {
      if(spots.getRange(i+1, 2).getValue() != ""){
        sendNotification(spots.getRange(i+1, 2).getValue(), spots.getRange(i+1, 3).getValue(),"נסיעה טובה!")
      }
      spots.getRange(i+1, 2).setValue(name);
      spots.getRange(i+1, 3).setValue(phone)
      break;
    }
  }
}
  
