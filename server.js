const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Render đứng sau proxy HTTPS
app.set('trust proxy', 1);

// Ép dùng HTTPS khi chạy trên Render (micro chỉ hoạt động trên https/localhost)
app.use((req, res, next) => {
  if (process.env.RENDER && req.headers['x-forwarded-proto'] === 'http') {
    return res.redirect(301, 'https://' + req.headers.host + req.originalUrl);
  }
  next();
});

// Cho phép trang xin quyền micro
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'microphone=(self)');
  next();
});

app.get('/healthz', (req, res) => res.send('ok'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Vong dang chay o cong ' + PORT);
});
