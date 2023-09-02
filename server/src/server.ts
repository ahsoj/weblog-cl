import express, { Request, Response } from 'express';
import auth from './auth/auth.routes';
import users from './users/users.routes';
import article from './posts/posts.routes';
import comment from './feedback/feedbacks.routes';
import cors from 'cors';
import session from 'express-session';

const app = express();
const PORT: number = 8080;
const memoryStore = new session.MemoryStore();

const session_conf = {
  secret: process.env.PXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
  // genid: function (req) {
  //   return genuuid(); // use UUIDs for session IDs
  // },
  cookie: {},
};

const corsOptions = {
  origin: 'http://127.0.0.1:3000',
  optionsSuccessStatus: 200,
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  session_conf.cookie['secure'] = true; // serve secure cookies
}

const D = new Date();
const ts = `${D.getHours()}:${D.getMinutes()}:${D.getSeconds()}`;

app.use((req, res, next) => {
  console.log(` - ${ts} - ${req.method}:${req.url}`);
  next();
});

app.use(session(session_conf));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.options('*', cors());

app.use('/v1/auth', auth);
app.use('/v1/users', users);
app.use('/v1', article);
app.use('/v1/feedback', comment);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
