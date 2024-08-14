// vercel --prod
const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();

server.use(cors());

const db = JSON.parse(fs.readFileSync(path.join('db.json')));
const router = jsonServer.router(db);

// const router = jsonServer.router(path.resolve(__dirname, 'db.json'));

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

// Endpoint for login
server.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const db = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'),
    );
    const { users = [] } = db;

    const userFromBd = users.find(
      (user) => user.username === username && user.password === password,
    );

    if (userFromBd) {
      return res.json(userFromBd);
    }

    return res.status(403).json({ message: 'User not found' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});

// Check if the user is authorized
server.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'AUTH ERROR' });
  }

  next();
});

server.use(router);

// Start the server
server.listen(8000, () => {
  console.log('server is running on 8000 port');
});
