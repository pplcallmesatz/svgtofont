const express = require('express');
const multer = require('multer');
const webfont = require('webfont').default;
const JSZip = require('jszip');
const path = require('path');
const fs = require('fs');
const os = require('os');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { sequelize, User, Group, Icon } = require('./models');

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 256 * 1024 } // 256 KB per file
});

const ICON_LIMIT = 20; // <--- This is where ICON_LIMIT is set

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Parse JSON bodies
app.use(express.json());

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Auth endpoints
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password_hash: hash });
    req.session.userId = user.id;
    res.json({ message: 'Registered', user: { id: user.id, username: user.username } });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });
  req.session.userId = user.id;
  res.json({ message: 'Logged in', user: { id: user.id, username: user.username } });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// Place this helper at the top-level, before both endpoints
function generateDemoHtml(result) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Icon Font Demo</title>
  <link rel="stylesheet" href="style.css">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Inter', sans-serif; background: #f7f8fa; margin: 0; padding: 0; }
    .container { max-width: 700px; margin: 2em auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px #0001; padding: 2.5em 2em; }
    h1 { font-size: 2.2em; font-weight: 800; color: #2d3748; margin-bottom: 0.5em; }
    h2 { font-size: 1.3em; color: #4a5568; margin-top: 2em; margin-bottom: 0.7em; }
    pre, code { background: #f1f5f9; color: #2d3748; border-radius: 6px; padding: 0.5em 0.8em; font-size: 1em; }
    .install-steps { background: #f1f5f9; border-radius: 10px; padding: 1.2em 1em; margin-bottom: 2em; }
    .install-steps ol { margin: 0 0 0 1.2em; padding: 0; color: #4a5568; }
    .install-steps li { margin-bottom: 0.7em; }
    .example-row { display: flex; align-items: center; gap: 1em; margin-top: 0.7em; }
    .example-icon { font-size: 2em; background: #f7fafc; border-radius: 8px; border: 1px solid #e2e8f0; width: 2.5em; height: 2.5em; display: flex; align-items: center; justify-content: center; }
    .icon-list { width: 100%; border-collapse: collapse; margin-top: 1em; }
    .icon-list th, .icon-list td { padding: 0.7em 0.5em; text-align: left; }
    .icon-list th { color: #718096; font-weight: 700; border-bottom: 2px solid #e2e8f0; }
    .icon-list tr { border-bottom: 1px solid #e2e8f0; }
    .icon-list td { vertical-align: middle; }
    .icon-demo { font-size: 2em; display: flex; align-items: center; justify-content: center; width: 2.5em; height: 2.5em; background: #f7fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
    .class-name { font-family: monospace; color: #2b6cb0; font-size: 1.1em; background: #f1f5f9; border-radius: 4px; padding: 0.2em 0.5em; }
    .copy-btn { background: #edf2f7; color: #2b6cb0; border: none; border-radius: 4px; padding: 0.2em 0.8em; margin-left: 0.7em; cursor: pointer; font-size: 1em; transition: background 0.2s; }
    .copy-btn:hover, .copy-btn.copied { background: #2b6cb0; color: #fff; }
    @media (max-width: 600px) {
      .container { padding: 1em 0.5em; }
      .icon-list th, .icon-list td { padding: 0.5em 0.2em; }
      .icon-demo, .example-icon { font-size: 1.5em; width: 2em; height: 2em; }
    }
  </style>
  <link href="https://fonts.googleapis.com/css?family=Inter:400,700,800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="container">
    <h1>Icon Font Demo</h1>
    <div class="install-steps">
      <h2>Installation & Usage</h2>
      <ol>
        <li><b>Copy</b> the <code>style.css</code> file and the entire <code>fonts/</code> folder into your project directory.</li>
        <li><b>Add</b> this line to your HTML <code>&lt;head&gt;</code>:
          <pre>&lt;link rel=\"stylesheet\" href=\"style.css\"&gt;</pre>
        </li>
        <li><b>Use</b> an icon in your HTML like this:
          <pre>&lt;span class=\"icon icon-<b>[name]</b>\"&gt;&lt;/span&gt;</pre>
          <span style=\"color:#718096;font-size:0.95em;\">Replace <code>[name]</code> with the icon name from the list below.</span>
        </li>
      </ol>
      <div class="example-row">
        <span class="example-icon icon icon-${result.glyphsData[0]?.metadata.name || 'example'}"></span>
        <span style="color:#4a5568;">Example: <code>&lt;span class="icon icon-${result.glyphsData[0]?.metadata.name || 'example'}"&gt;&lt;/span&gt;</code></span>
      </div>
    </div>
    <h2>Icon List</h2>
    <table class="icon-list">
      <thead>
        <tr><th>Preview</th><th>Class Name</th><th></th></tr>
      </thead>
      <tbody>
        ${result.glyphsData.map(g => `
          <tr>
            <td><span class="icon-demo icon icon-${g.metadata.name}"></span></td>
            <td><span class="class-name" id="class-${g.metadata.name}">icon icon-${g.metadata.name}</span></td>
            <td><button class="copy-btn" onclick="copyClassName('icon icon-${g.metadata.name}', this)">Copy</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  <script>
    function copyClassName(className, btn) {
      navigator.clipboard.writeText(className).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1200);
      });
    }
  </script>
</body>
</html>`;
}

app.post('/generate', upload.array('svgs'), async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No SVG files uploaded.' });
  }
  if (files.length > 20) {
    return res.status(400).json({ error: 'Maximum 3 SVG files allowed. For unlimited access, clone or fork the repo and self-host.' });
  }
  const tmpDir = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  // Save SVGs to temp dir
  const svgPaths = [];
  for (const file of files) {
    const filePath = path.join(tmpDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    svgPaths.push(filePath);
  }
  // Add debug logs here
  console.log('SVG paths for webfont:', svgPaths);
  console.log('Is array:', Array.isArray(svgPaths));
  console.log('All strings:', svgPaths.every(p => typeof p === 'string'));
  console.log('Array length:', svgPaths.length);
  svgPaths.forEach(p => {
    console.log('Exists:', p, fs.existsSync(p));
  });
  // Generate font files
  const testSvgPath = path.join(__dirname, 'test.svg');
  console.log('Testing with hardcoded SVG:', testSvgPath, fs.existsSync(testSvgPath));
  const result = await webfont({
    files: svgPaths,
    fontName: 'iconfont',
    formats: ['ttf', 'woff', 'woff2', 'eot', 'svg'],
    template: 'css',
    templateClassName: 'icon',
    templateFontPath: './fonts/',
  });
  // Create a ZIP file
  const zip = new JSZip();
  // Add font files
  zip.file('fonts/iconfont.ttf', result.ttf);
  zip.file('fonts/iconfont.woff', result.woff);
  zip.file('fonts/iconfont.woff2', result.woff2);
  zip.file('fonts/iconfont.eot', result.eot);
  zip.file('fonts/iconfont.svg', result.svg);
  // Add CSS
  zip.file('style.css', result.template);
  // Add demo HTML
  const demoHtml = generateDemoHtml(result);
  zip.file('demo.html', demoHtml);
  // Send ZIP
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  res.set('Content-Type', 'application/zip');
  res.set('Content-Disposition', 'attachment; filename="iconfont.zip"');
  res.send(zipBuffer);
  // Clean up temp files
  svgPaths.forEach(p => fs.unlinkSync(p));
});

// Create a new group
app.post('/api/groups', requireAuth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Group name required' });
  try {
    const group = await Group.create({ name, user_id: req.session.userId });
    res.json({ group });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// List all groups for the logged-in user
app.get('/api/groups', requireAuth, async (req, res) => {
  const groups = await Group.findAll({ where: { user_id: req.session.userId } });
  res.json({ groups });
});

// Upload icons to a group
app.post('/api/groups/:groupId/icons', requireAuth, upload.array('svgs'), async (req, res) => {
  const { groupId } = req.params;
  const group = await Group.findOne({ where: { id: groupId, user_id: req.session.userId } });
  if (!group) return res.status(404).json({ error: 'Group not found' });
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No SVG files uploaded' });

  // Enforce max ICON_LIMIT icons per group
  const currentCount = await Icon.count({ where: { group_id: group.id, user_id: req.session.userId } });
  if (currentCount >= ICON_LIMIT) {
    return res.status(400).json({ error: `Max ${ICON_LIMIT} icons per group. Delete some to add more.` });
  }
  if (currentCount + req.files.length > ICON_LIMIT) {
    return res.status(400).json({ error: `Uploading these files would exceed the ${ICON_LIMIT} icon limit per group.` });
  }

  try {
    const icons = [];
    const iconDir = path.join(__dirname, 'user_icons', String(req.session.userId), String(groupId));
    fs.mkdirSync(iconDir, { recursive: true });
    for (const file of req.files) {
      const filePath = path.join(iconDir, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      const icon = await Icon.create({ filename: file.originalname, group_id: group.id, user_id: req.session.userId });
      icons.push(icon);
    }
    res.json({ icons });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload icons' });
  }
});

// List icons in a group
app.get('/api/groups/:groupId/icons', requireAuth, async (req, res) => {
  const { groupId } = req.params;
  const group = await Group.findOne({ where: { id: groupId, user_id: req.session.userId } });
  if (!group) return res.status(404).json({ error: 'Group not found' });
  const icons = await Icon.findAll({ where: { group_id: group.id, user_id: req.session.userId } });
  res.json({ icons });
});

// Export icons in a group as font ZIP
app.post('/api/groups/:groupId/export', requireAuth, async (req, res) => {
  const { groupId } = req.params;
  const group = await Group.findOne({ where: { id: groupId, user_id: req.session.userId } });
  if (!group) return res.status(404).json({ error: 'Group not found' });
  const icons = await Icon.findAll({ where: { group_id: group.id, user_id: req.session.userId } });
  if (!icons.length) return res.status(400).json({ error: 'No icons in group' });
  if (icons.length > ICON_LIMIT) return res.status(400).json({ error: `Cannot export: More than ${ICON_LIMIT} icons in this group. Please delete some icons.` });
  const iconDir = path.join(__dirname, 'user_icons', String(req.session.userId), String(groupId));
  const svgPaths = icons.map(icon => path.join(iconDir, icon.filename));
  // Check all files exist
  for (const p of svgPaths) {
    if (!fs.existsSync(p)) return res.status(500).json({ error: `Missing file: ${p}` });
  }
  try {
    const result = await webfont({
      files: svgPaths,
      fontName: 'iconfont',
      formats: ['ttf', 'woff', 'woff2', 'eot', 'svg'],
      template: 'css',
      templateClassName: 'icon',
      templateFontPath: './fonts/',
    });
    const zip = new JSZip();
    zip.file('fonts/iconfont.ttf', result.ttf);
    zip.file('fonts/iconfont.woff', result.woff);
    zip.file('fonts/iconfont.woff2', result.woff2);
    zip.file('fonts/iconfont.eot', result.eot);
    zip.file('fonts/iconfont.svg', result.svg);
    zip.file('style.css', result.template);
    const demoHtml = generateDemoHtml(result);
    zip.file('demo.html', demoHtml);
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename="iconfont.zip"');
    res.send(zipBuffer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate font.' });
  }
});

// Rename a group
app.patch('/api/groups/:groupId', requireAuth, async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Group name required' });
  const group = await Group.findOne({ where: { id: groupId, user_id: req.session.userId } });
  if (!group) return res.status(404).json({ error: 'Group not found' });
  group.name = name;
  await group.save();
  res.json({ group });
});

// Delete a group (and its icons/files)
app.delete('/api/groups/:groupId', requireAuth, async (req, res) => {
  const { groupId } = req.params;
  const group = await Group.findOne({ where: { id: groupId, user_id: req.session.userId } });
  if (!group) return res.status(404).json({ error: 'Group not found' });
  const icons = await Icon.findAll({ where: { group_id: group.id, user_id: req.session.userId } });
  const iconDir = path.join(__dirname, 'user_icons', String(req.session.userId), String(groupId));
  // Delete icon files
  for (const icon of icons) {
    const filePath = path.join(iconDir, icon.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await icon.destroy();
  }
  // Remove group dir if empty
  if (fs.existsSync(iconDir)) {
    try { fs.rmdirSync(iconDir); } catch {}
  }
  await group.destroy();
  res.json({ message: 'Group deleted' });
});

// Delete an icon (and its file)
app.delete('/api/groups/:groupId/icons/:iconId', requireAuth, async (req, res) => {
  const { groupId, iconId } = req.params;
  const icon = await Icon.findOne({ where: { id: iconId, group_id: groupId, user_id: req.session.userId } });
  if (!icon) return res.status(404).json({ error: 'Icon not found' });
  const iconDir = path.join(__dirname, 'user_icons', String(req.session.userId), String(groupId));
  const filePath = path.join(iconDir, icon.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await icon.destroy();
  res.json({ message: 'Icon deleted' });
});

// Serve public files (index.html, login.html, etc.)
app.use(express.static('public'));

// Custom user_icons route (for protected access)
app.get('/user_icons/:userId/:groupId/:filename', (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.status(403).send('Forbidden');
  }
  // Only allow access to their own files
  if (parseInt(req.params.userId, 10) !== req.session.userId) {
    return res.status(403).send('Forbidden');
  }
  const filePath = path.join(__dirname, 'user_icons', req.params.userId, req.params.groupId, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Not found');
  }
  res.sendFile(filePath);
});

// Pretty URLs for static HTML pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/group/:groupId/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'group.html'));
});

app.patch('/api/groups/:groupId/icons/:iconId', requireAuth, async (req, res) => {
  const { groupId, iconId } = req.params;
  let { filename } = req.body;
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename is required' });
  }
  filename = filename.trim();

  // Ensure .svg extension
  if (!filename.toLowerCase().endsWith('.svg')) {
    filename += '.svg';
  }

  // Prevent empty or all-whitespace names
  if (!filename.replace('.svg', '').trim()) {
    return res.status(400).json({ error: 'Filename cannot be empty' });
  }

  // Prevent duplicate (case-insensitive)
  const duplicate = await Icon.findOne({
    where: {
      group_id: groupId,
      user_id: req.session.userId,
      filename: sequelize.where(
        sequelize.fn('lower', sequelize.col('filename')),
        filename.toLowerCase()
      )
    }
  });
  if (duplicate && String(duplicate.id) !== String(iconId)) {
    return res.status(400).json({ error: 'Duplicate filename in this group' });
  }

  // Find the icon
  const icon = await Icon.findOne({ where: { id: iconId, group_id: groupId, user_id: req.session.userId } });
  if (!icon) return res.status(404).json({ error: 'Icon not found' });

  // Get all icons with the same filename (case-insensitive)
  const sameNameIcons = await Icon.findAll({
    where: {
      group_id: groupId,
      user_id: req.session.userId,
      filename: sequelize.where(
        sequelize.fn('lower', sequelize.col('filename')),
        icon.filename.toLowerCase()
      )
    }
  });

  // Rename or duplicate file on disk
  const iconDir = path.join(__dirname, 'user_icons', String(req.session.userId), String(groupId));
  const oldPath = path.join(iconDir, icon.filename);
  const newPath = path.join(iconDir, filename);
  if (fs.existsSync(newPath) && icon.filename.toLowerCase() !== filename.toLowerCase()) {
    return res.status(400).json({ error: 'A file with that name already exists' });
  }
  try {
    if (sameNameIcons.length > 1) {
      // Duplicate file for this icon only
      if (!fs.existsSync(oldPath)) {
        return res.status(404).json({ error: 'Original file not found for duplication' });
      }
      fs.copyFileSync(oldPath, newPath);
      icon.filename = filename;
      await icon.save();
      res.json({ icon });
    } else {
      // Only one entry, safe to rename
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
      icon.filename = filename;
      await icon.save();
      res.json({ icon });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to rename or duplicate file' });
  }
});

// Profile endpoints
app.get('/api/profile', requireAuth, async (req, res) => {
  const user = await User.findByPk(req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ username: user.username, name: user.name, email: user.email });
});

app.patch('/api/profile', requireAuth, async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByPk(req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (typeof name !== 'undefined') user.name = name;
  if (typeof email !== 'undefined') user.email = email;
  try {
    await user.save();
    res.json({ message: 'Profile updated', name: user.name, email: user.email });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email already in use' });
    } else {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
});

app.post('/api/profile/change-password', requireAuth, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'All password fields are required' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }
  const user = await User.findByPk(req.session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const match = await bcrypt.compare(oldPassword, user.password_hash);
  if (!match) return res.status(400).json({ error: 'Old password is incorrect' });
  user.password_hash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password changed successfully' });
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/api/config', (req, res) => {
  res.json({ iconLimit: ICON_LIMIT });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 