// ============================================================================
// GOOGLE APPS SCRIPT CODE
// ============================================================================
//
// IMPORTANT: This file should NOT be included in your website deployment!
//
// Instructions:
// 1. Go to https://script.google.com/
// 2. Create a new project
// 3. Replace the default code with the code below
// 4. Deploy as a web app
// 5. Copy the web app URL and use it in script.js
//
// The SpreadsheetApp and ContentService are built-in Google Apps Script APIs
// and will work correctly when deployed in the Google Apps Script environment.
// ============================================================================

function doPost(e) {
  try {
    // Parse the JSON data
    const data = JSON.parse(e.postData.contents)

    // Get or create the spreadsheet
    const spreadsheetId = "YOUR_SPREADSHEET_ID_HERE" // Replace with your Google Sheets ID
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet()

    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp",
        "Name",
        "Email",
        "Phone",
        "University",
        "Year",
        "College",
        "Subjects",
        "Total Amount",
        "Transaction Reference",
      ]
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    }

    // Add the new row
    const newRow = [
      new Date(data.timestamp),
      data.name,
      data.email,
      data.phone,
      data.university,
      data.year,
      data.college,
      data.subjects,
      data.totalAmount,
      data.transactionRef,
    ]

    sheet.appendRow(newRow)

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}

// Allow CORS
function doGet(e) {
  return ContentService.createTextOutput("StuDental Form Handler").setMimeType(ContentService.MimeType.TEXT)
}
