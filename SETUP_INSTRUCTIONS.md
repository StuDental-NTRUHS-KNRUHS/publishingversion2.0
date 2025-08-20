# StuDental Website Setup Instructions

## Google Sheets Integration Setup

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "StuDental Enrollments"
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 2: Set up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the code below:

\`\`\`javascript
// Google Apps Script Code - Paste this in script.google.com
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
\`\`\`

5. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID
6. Save the project (name it "StuDental Form Handler")

### Step 3: Deploy the Script
1. Click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Execute as: "Me"
4. **⚠️ IMPORTANT: Who has access: "Anyone"** (This prevents CORS errors)
5. Click "Deploy"
6. **Copy the web app URL** (it should end with `/exec`)

### Step 4: Update Website Code
1. Open `script.js`
2. Find the line: `const scriptURL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"`
3. Replace with your actual web app URL from Step 3

### Step 5: Update Payment Details
1. Replace `upi-qr-code.png` with your actual UPI QR code
2. Update bank details in `join.html` (search for "Bank Transfer" section)

## File Structure for Deployment
\`\`\`
studental-website/
├── index.html
├── join.html
├── resources.html
├── about.html
├── privacy.html
├── styles.css
├── script.js
├── upi-qr-code.png
└── SETUP_INSTRUCTIONS.md
\`\`\`

## Important Notes
- The Google Apps Script code should be pasted in script.google.com, NOT in your website files
- SpreadsheetApp and ContentService are built-in Google Apps Script APIs
- All form submissions will automatically appear in your Google Sheet
- **CRITICAL**: Make sure to set "Anyone" access when deploying to prevent CORS errors

## Testing
1. Deploy your website to any web hosting service
2. Fill out the enrollment form
3. Check your Google Sheet for the new entry
4. Verify you receive the success message

## Troubleshooting CORS Errors

### If you get "preflightmissingalloworiginheader" error:
1. **Check Google Apps Script deployment settings:**
   - Go to your Apps Script project
   - Click "Deploy" → "Manage deployments"
   - Ensure "Who has access" is set to **"Anyone"**
   - If not, create a new deployment with correct settings

2. **Verify the URL in script.js:**
   - Make sure you're using the `/exec` URL, not `/dev`
   - The URL should look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

3. **Test the Google Apps Script directly:**
   - Visit your script URL in a browser
   - You should see "StuDental Form Handler" text

### Common Issues:
- **"URL not configured"**: Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` in script.js
- **"Access denied"**: Ensure Google Apps Script is deployed with "Anyone" access
- **"Network error"**: Check if the script URL is correct and accessible

## Support
For any issues, contact: studental.queries@gmail.com
