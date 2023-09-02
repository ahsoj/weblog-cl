"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const auth_services_1 = __importDefault(require("./auth.services"));
const users_services_1 = __importDefault(require("../users/users.services"));
const body_parser_1 = __importDefault(require("body-parser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const prisma_1 = require("../utils/prisma");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
// const confirm_msg = {
//   personalizations: [
//     {
//       to: [{ email, name: username }],
//       dynamic_template_data: {
//         confirmButton:
//           "<a href='https://www.blogdesire.com' id='clickbutton' target='_blank'>Confirm Email</a>",
//         LinkreplaceBUtton:
//           "<a href='https://blogdesire.com' target='_blank'>click me here</a>",
//       },
//     },
//   ],
//   from: {
//     email: process.env.SENDER_EMAIL,
//     name: process.env.SENDER_NAME,
//   },
//   // reply_to: { email: mailSender.replyemail, name: mailSender.replyname },
//   template_id: process.env.TEMPLATE_ID_VERIFY_EMAIL,
//   dynamicTemplateData: {
//     confirmButton:
//       "<a href='https://www.blogdesire.com' id='clickbutton' target='_blank'>Confirm Email</a>",
//     LinkreplaceBUtton:
//       "<a href='https://blogdesire.com' target='_blank'>click me here</a>",
//   },
//   content: [
//     {
//       type: 'text/html',
//       value: '<p>some content vaule</p>',
//     },
//   ],
// };
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const router = express_1.default.Router();
exports.default = router;
const { JWT_REFRESH_SECRET } = process.env;
const jsonParser = body_parser_1.default.json();
const urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
router.post('/register', jsonParser, async (req, res, next) => {
    try {
        const { email, name: username, password: passwordHash } = req.body;
        if (!username || !email || !passwordHash) {
            res
                .status(400)
                .send('You must provide an email, username and password');
            return;
        }
        const existsingUser = await users_services_1.default.findUserByEmail(email);
        if (existsingUser) {
            res.status(400).send('Email already in use.');
            return;
        }
        const user = await users_services_1.default.createUserWithPassword({
            username,
            email,
            passwordHash,
        });
        ejs_1.default
            .renderFile(path_1.default.join(__dirname, 'email_templates/verify_email.ejs'), {
            confirmButton: "<a href='https://www.blogdesire.com' id='clickbutton' target='_blank'>Confirm Email</a>",
            linkreplaceBUtton: "<a href='https://blogdesire.com' target='_blank'>click me here</a>",
        })
            .then((result) => {
            const msg = {
                to: email,
                from: 'mkeyasuc@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                // text: 'and easy to do anywhere, even with Node.js',
                html: result,
            };
            mail_1.default
                .send(msg)
                .then((response) => {
                console.log(response[0].statusCode);
                // console.log(response[0].headers);
            })
                .catch((error) => {
                console.error(error);
            });
        })
            .catch((err) => {
            res.status(400).json({
                message: 'Error Rendering emailTemplate',
                error: err,
            });
        });
        const jti = (0, uuid_1.v4)();
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user, jti);
        await auth_services_1.default.addRefreshTokenWhiteList({
            refreshToken,
            userId: user.id,
        });
        res.json({
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        next(err);
    }
});
router.get('/resetnew/token/:token', async (req, res, next) => {
    try {
        const { token } = req.params;
        res.render('<strong>Correct</strong>');
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', jsonParser, async (req, res, next) => {
    try {
        const { email, password: passwordHash } = req.body;
        console.log(email);
        if (!email || !passwordHash) {
            res.status(400).send('You must provide a valid email or password');
            return;
        }
        const existingUser = await users_services_1.default.findUserByEmail(email);
        if (!existingUser) {
            res.status(403).send('Invalid login credentials.');
            return;
        }
        const validPassword = await bcrypt_1.default.compare(passwordHash, existingUser.passwordHash);
        if (!validPassword) {
            res.status(403).send(`Invalid login credentials.`);
            return;
        }
        const jti = (0, uuid_1.v4)();
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(existingUser, jti);
        await auth_services_1.default.addRefreshTokenWhiteList({
            refreshToken,
            userId: existingUser.id,
        });
        res.json({
            accessToken,
            refreshToken,
            id: existingUser.id,
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/reset_password/', async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).send('Invalid request please check again.');
        if (!(await users_services_1.default.findUserByEmail(email)))
            return res.status(404).send("We Can't find an account with this email");
        const reset_uuid = await prisma_1.prisma.resetUUID.create({
            data: { uuid: (0, uuid_1.v4)() },
        });
        const link = `http://127.0.0.1:3000/signin/reset/set_new/?uid=${reset_uuid.uuid}/?redirect=popular`;
        ejs_1.default
            .renderFile(path_1.default.join(__dirname, 'email_templates/verify_email.ejs'), {
            confirmButton: link,
            linkreplaceBUtton: link,
        })
            .then((result) => {
            const msg = {
                to: email,
                from: 'mkeyasuc@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                // text: 'and easy to do anywhere, even with Node.js',
                html: result,
            };
            mail_1.default
                .send(msg)
                .then((response) => {
                console.log(response[0].statusCode);
                // console.log(response[0].headers);
            })
                .catch((error) => {
                console.error(error);
            });
        })
            .catch((err) => {
            res.status(400).json({
                message: 'Error Rendering emailTemplate',
                error: err,
            });
        });
        res.status(200).json(reset_uuid.id);
    }
    catch (error) {
        next(error);
    }
});
router.post('/refreshToken', urlencodedParser, async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            return Promise.reject('Missing refresh token.');
        }
        const { jti: Jti, userId } = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        const savedRefreshToken = await auth_services_1.default.findRefreshTokenById(Jti);
        if (!savedRefreshToken || savedRefreshToken.revoked) {
            res.status(401);
            throw new Error('Unauthorized.');
        }
        const hashedToken = (0, jwt_1.hashTokens)(refreshToken);
        if (hashedToken !== savedRefreshToken.hashedToken) {
            res.status(401);
            throw new Error('Unauthorized.');
        }
        const user = await users_services_1.default.findUserById(userId);
        if (!user) {
            res.status(401);
            throw new Error('Unauthorized.');
        }
        await auth_services_1.default.deleteRefreshToken(savedRefreshToken.id);
        const jti = (0, uuid_1.v4)();
        const { accessToken, refreshToken: newRefreshToken } = (0, jwt_1.generateTokens)(user, jti);
        await auth_services_1.default.addRefreshTokenWhiteList({
            refreshToken: newRefreshToken,
            userId: user.id,
        });
        res.json({
            accessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (err) {
        next(err);
    }
});
router.post('/revokeRefreshTokens', async (req, res, next) => {
    try {
        const { userId } = req.body;
        await auth_services_1.default.revokedTokens(userId);
        res.json({ message: `Tokens revoked for user with id #${userId}` });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=auth.routes.js.map