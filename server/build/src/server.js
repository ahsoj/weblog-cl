"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const posts_routes_1 = __importDefault(require("./posts/posts.routes"));
const feedbacks_routes_1 = __importDefault(require("./feedback/feedbacks.routes"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const PORT = 8080;
const memoryStore = new express_session_1.default.MemoryStore();
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
app.use((0, express_session_1.default)(session_conf));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.options('*', (0, cors_1.default)());
app.use('/v1/auth', auth_routes_1.default);
app.use('/v1/users', users_routes_1.default);
app.use('/v1', posts_routes_1.default);
app.use('/v1/feedback', feedbacks_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map