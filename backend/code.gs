var SHEET_NAME_CONTACT = "Contact_Data";
var SHEET_NAME_MONEY = "Donation_Money";
var SHEET_NAME_MATERIAL = "Donation_Materials";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet;
    
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    var type = data.type || "unknown";

    // Select Sheet based on Type
    if (type === "contact_message") {
      sheet = doc.getSheetByName(SHEET_NAME_CONTACT);
      if (!sheet) {
        sheet = doc.insertSheet(SHEET_NAME_CONTACT);
        sheet.appendRow(["Date", "Name", "Email", "Phone", "Message"]);
      }
      sheet.appendRow([new Date(), data.name, data.email, data.phone, data.message]);
      
    } else if (type === "donation_money") {
      sheet = doc.getSheetByName(SHEET_NAME_MONEY);
      if (!sheet) {
        sheet = doc.insertSheet(SHEET_NAME_MONEY);
        sheet.appendRow(["Date", "Name", "Email", "Phone", "Amount", "Transaction ID"]);
      }
      sheet.appendRow([new Date(), data.name, data.email, data.phone, data.amount, data.transactionId]);
      
    } else if (type === "donation_material") {
      sheet = doc.getSheetByName(SHEET_NAME_MATERIAL);
      if (!sheet) {
        sheet = doc.insertSheet(SHEET_NAME_MATERIAL);
        sheet.appendRow(["Date", "Name", "Email", "Phone", "Category", "Description", "Address"]);
      }
      sheet.appendRow([new Date(), data.name, data.email, data.phone, data.category, data.description, data.address]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "type": type }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
