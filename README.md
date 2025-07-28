# SVG to Font Icon Web App

A modern web application to convert SVG icons to a font, organize icons into groups, and manage your icon library.  
**Free version:** Upload and download up to 20 icons per group.  
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
- **PostgreSQL Support:** Cloud-ready with PostgreSQL database support.

---

## Demo

[Live Demo](https://svgtofonticon.onrender.com/)  
Try the app online with full functionality!

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
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with your database configuration:

```env
DATABASE_URL=postgresql://username:password@host:port/database
DB_DIALECT=postgres
```

**For local PostgreSQL:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/svgtofont
DB_DIALECT=postgres
```

**For cloud databases (Render, Heroku, etc.):**
```env
DATABASE_URL=postgresql://user:pass@host.com/database
DB_DIALECT=postgres
```

### 4. Run Database Migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Start the Server

```bash
node server.js
```

- The server will run at [http://localhost:3000](http://localhost:3000)

---

## Configuration

### Icon Limit

- The maximum number of icons per group/upload is controlled by a single variable in `server.js`:
  ```js
  const ICON_LIMIT = 2000; // Change this value to set your own limit
  ```
- The frontend fetches this value automatically from the backend.

### Database Configuration

- The app uses **PostgreSQL** with Sequelize ORM.
- Database configuration is managed through environment variables.
- SSL is automatically configured for cloud database connections.

---

## Project Structure

```
svgtofont/
├── config/
│   └── config.js          # Database configuration
├── migrations/            # Database migration files
├── models.js             # Sequelize models
├── server.js             # Express server
├── public/               # Static HTML files
│   ├── index.html        # Main SVG to font converter
│   ├── login.html        # Login page
│   ├── register.html     # Registration page
│   ├── dashboard.html    # User dashboard
│   ├── group.html        # Group management
│   └── profile.html      # User profile
├── user_icons/           # User uploaded icons
└── .env                  # Environment variables
```

---

## Usage

- **SVG to Font:** Use the main page to upload SVGs and download a font.
- **Groups:** Register and log in to organize icons into groups at `/dashboard`.
- **Profile:** Update your name, email, and password at `/profile`.
- **Export:** Download all icons in a group as a font ZIP.

---

## Dependencies

- **Express.js** - Web framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - Database (with `pg` driver)
- **Webfont** - SVG to font conversion
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **Express-session** - Session management
- **JSZip** - ZIP file generation
- **Dotenv** - Environment variable management

---

## Self-Hosting & Unlimited Use

To remove all limits:
1. Clone this repo.
2. Set up your PostgreSQL database.
3. Configure your `.env` file with your database URL.
4. Change the `ICON_LIMIT` value in `server.js`.
5. Deploy on your own server.

---

## Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
DATABASE_URL=your_production_database_url
DB_DIALECT=postgres
NODE_ENV=production
```

### Supported Platforms

- **Vercel** - Use the included `vercel.json`
- **Heroku** - Add PostgreSQL addon
- **Railway** - Direct PostgreSQL support
- **Render** - PostgreSQL service available

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