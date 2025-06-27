# SVG to Font Icon Web App

A modern web application to convert SVG icons to a font, organize icons into groups, and manage your icon library.  
**Self-host for unlimited use!**

---

## Features

- **SVG to Font Conversion:** Upload SVGs and download as a webfont (TTF, WOFF, WOFF2, EOT, SVG) with CSS and demo HTML.
- **Group Management:** Organize icons into groups (requires registration).
- **User Authentication:** Secure login, registration, and profile management.
- **Modern UI:** Responsive, clean, and user-friendly interface.
- **Limits:** Free version allows up to 20 icons per group/upload/download.
- **Self-hosting:** Remove all limits by changing a single variable and running on your own server.
- **Buy Me a Coffee widget:** Support the developer directly from the app.

---

## Demo

[Live Demo](https://your-demo-url.com)  
(Replace with your deployed URL if available.)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/pplcallmesatz/svgtofont.git
cd svgtofont
```

### 2. Install Dependencies

```bash
npm install
cd client
npm install
cd ..
```

### 3. Configure the Database

- This app uses **MySQL** via Sequelize.
- Create a database (e.g., `font`).
- Update your MySQL credentials in `models.js` and `config/config.json` if needed.

### 4. Run Migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Start the Server

```bash
node server.js
```

- The server will run at [http://localhost:3000](http://localhost:3000)

### 6. (Optional) Start the React Client

If you want to use the React client in `client/` (not required for the main app):

```bash
cd client
npm start
```

---

## Configuration

### Icon Limit

- The maximum number of icons per group/upload is controlled by a single variable in `server.js`:
  ```js
  const ICON_LIMIT = 20; // Change this value to set your own limit
  ```
- The frontend fetches this value automatically from the backend.

---

## Usage

- **SVG to Font:** Use the main page to upload SVGs and download a font.
- **Groups:** Register and log in to organize icons into groups at `/dashboard`.
- **Profile:** Update your name, email, and password at `/profile`.
- **Export:** Download all icons in a group as a font ZIP.

---

## Self-Hosting & Unlimited Use

To remove all limits:
1. Clone this repo.
2. Change the `ICON_LIMIT` value in `server.js`.
3. Deploy on your own server.

---

## Developer

**Name:** Satheesh Kumar S  
**Github Profile:** [github.com/pplcallmesatz](https://github.com/pplcallmesatz/)  
**Github Repo:** [github.com/pplcallmesatz/svgtofont](https://github.com/pplcallmesatz/svgtofont)  
**Email:** [satheeshssk@icloud.com](mailto:satheeshssk@icloud.com)  
**Instagram:** [instagram.com/pplcallmesatz](http://instagram.com/pplcallmesatz)

---

## Support

If you find this tool useful, consider supporting me:  
[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/satheeshdesign)

---

## Disclaimer

> This tool is fully generated using AI tools. Issues may be expected.  
> Please report bugs or contribute via pull requests! 
