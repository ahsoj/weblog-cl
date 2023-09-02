import express from 'express';
import { v4 as uuid4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { generateTokens, hashTokens } from '@/utils/jwt.js';
import AuthServices from './auth.services.js';
import UsersServices from '@/users/users.services.js';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import sendgrid from '@sendgrid/mail';
import { prisma } from '@/utils/prisma.js';
import path from 'path';
import ejs from 'ejs';
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
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const router = express.Router();
const { JWT_REFRESH_SECRET } = process.env;
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.post('/register', jsonParser, async (req, res, next) => {
    try {
        const { email, name: username, password: passwordHash } = req.body;
        if (!username || !email || !passwordHash) {
            res
                .status(400)
                .send('You must provide an email, username and password');
            return;
        }
        const existsingUser = await UsersServices.findUserByEmail(email);
        if (existsingUser) {
            res.status(400).send('Email already in use.');
            return;
        }
        const user = await UsersServices.createUserWithPassword({
            username,
            email,
            passwordHash,
        });
        ejs
            .renderFile(path.join(__dirname, 'email_templates/verify_email.ejs'), {
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
            sendgrid
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
        const jti = uuid4();
        const { accessToken, refreshToken } = generateTokens(user, jti);
        await AuthServices.addRefreshTokenWhiteList({
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
        const existingUser = await UsersServices.findUserByEmail(email);
        if (!existingUser) {
            res.status(403).send('Invalid login credentials.');
            return;
        }
        const validPassword = await bcrypt.compare(passwordHash, existingUser.passwordHash);
        if (!validPassword) {
            res.status(403).send(`Invalid login credentials.`);
            return;
        }
        const jti = uuid4();
        const { accessToken, refreshToken } = generateTokens(existingUser, jti);
        await AuthServices.addRefreshTokenWhiteList({
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
        if (!(await UsersServices.findUserByEmail(email)))
            return res.status(404).send("We Can't find an account with this email");
        const reset_uuid = await prisma.resetUUID.create({
            data: { uuid: uuid4() },
        });
        const link = `http://127.0.0.1:3000/signin/reset/set_new/?uid=${reset_uuid.uuid}/?redirect=popular`;
        ejs
            .renderFile(path.join(__dirname, 'email_templates/verify_email.ejs'), {
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
            sendgrid
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
        const { jti: Jti, userId } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const savedRefreshToken = await AuthServices.findRefreshTokenById(Jti);
        if (!savedRefreshToken || savedRefreshToken.revoked) {
            res.status(401);
            throw new Error('Unauthorized.');
        }
        const hashedToken = hashTokens(refreshToken);
        if (hashedToken !== savedRefreshToken.hashedToken) {
            res.status(401);
            throw new Error('Unauthorized.');
        }
        const user = await UsersServices.findUserById(userId);
        if (!user) {
            res.status(401);
            throw new Error('Unauthorized.');
        }
        await AuthServices.deleteRefreshToken(savedRefreshToken.id);
        const jti = uuid4();
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
        await AuthServices.addRefreshTokenWhiteList({
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
        await AuthServices.revokedTokens(userId);
        res.json({ message: `Tokens revoked for user with id #${userId}` });
    }
    catch (err) {
        next(err);
    }
});
export { router as default };
//# sourceMappingURL=auth.routes.js.map