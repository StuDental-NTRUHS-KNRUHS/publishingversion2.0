# Google Apps Script Code

Copy this code to your Google Apps Script project:

\`\`\`javascript
function doPost(e) {
  try {
    // Replace with your actual Google Sheets ID
    const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    const SHEET_NAME = 'StuDental Enrollments';
    
    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 10).setValues([[
        'Timestamp', 'Name', 'Email', 'Phone', 'University', 
        'Year', 'College', 'Subjects', 'Total Amount', 'Transaction Ref'
      ]]);
    }
    
    // Add the data
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.university,
      data.year,
      data.college,
      data.subjects,
      data.totalAmount,
      data.transactionRef
    ]);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput('Success')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput('Error: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  // Handle preflight requests
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
\`\`\`

## Setup Steps:

1. **Go to script.google.com**
2. **Create a new project**
3. **Paste the above code**
4. **Replace `YOUR_SPREADSHEET_ID_HERE` with your Google Sheets ID**
5. **Save the project**
6. **Deploy as Web App:**
   - Click "Deploy" > "New Deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
7. **Copy the Web App URL**
8. **Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` in script.js with your actual URL**

The URL should look like:
`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`
