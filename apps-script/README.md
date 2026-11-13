# Connect the registration page to your Google Sheet (4 steps)

1. Open your Google Sheet. Menu: **Extensions → Apps Script**.
2. Delete everything in the editor, paste the whole content of `Code.gs`, click the save icon.
3. Click **Deploy → New deployment**. Click the gear next to "Select type" → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **Authorize access** (choose your account → Advanced → Go to project → Allow).
4. Copy the **Web app URL** (starts with `https://script.google.com/macros/s/`) and send it to Claude.

A tab named `Registrations` with headers is created by the first submission.
If you ever edit `Code.gs`: Deploy → Manage deployments → pencil icon → Version: New version → Deploy (the URL stays the same).
