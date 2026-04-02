## Save contact form messages to Google Sheets

### 1) Create the Google Sheet
- Create a new Google Sheet (any name).
- Add a sheet tab named `Responses`.
- In row 1, add headers:
  - `Timestamp`
  - `Name`
  - `Email`
  - `Message`
  - `Page`

### 2) Create an Apps Script Web App
- In the Google Sheet, go to **Extensions → Apps Script**
- Replace the code with this:

```javascript
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Responses') || ss.insertSheet('Responses');

  var name = (e.parameter.name || '').toString();
  var email = (e.parameter.email || '').toString();
  var message = (e.parameter.message || '').toString();
  var page = (e.parameter.page || '').toString();
  var ts = (e.parameter.ts || new Date().toISOString()).toString();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message', 'Page']);
  }

  sheet.appendRow([ts, name, email, message, page]);

  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### 3) Deploy
- Click **Deploy → New deployment**
- Select **Web app**
- **Execute as**: `Me`
- **Who has access**: `Anyone`
- Click **Deploy**
- Copy the **Web app URL** (it looks like `https://script.google.com/macros/s/.../exec`)

### 4) Paste the URL into your site
Open these files and set `data-sheets-endpoint`:
- `index.html`
- `Contact.html`

Example:

```html
<form id="contact-form" data-sheets-endpoint="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec">
```

