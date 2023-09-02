"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../middleware"));
const users_services_1 = __importDefault(require("./users.services"));
const router = express_1.default.Router();
exports.default = router;
router.get('/me/:userId', middleware_1.default, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await users_services_1.default.syncProfile(userId);
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});
router.patch('/profile/:userId/update', middleware_1.default, async (req, res, next) => {
    try {
        const { username, bio, socialLinks } = req.body;
        const { userId } = req.params;
        const updatedUser = await users_services_1.default.resyncProfile({
            userId,
            username,
            bio,
        });
        res.status(200).json(updatedUser);
    }
    catch (err) {
        next(err);
    }
});
router.post('/saved', middleware_1.default, async (req, res, next) => {
    try {
        const { saved } = req.body;
        const bookmark = await users_services_1.default.createBookmark(saved);
        res.status(200).send(bookmark);
    }
    catch (err) {
        next(err);
    }
});
router.get('/saved/ids/:userId', middleware_1.default, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const bookmark = await users_services_1.default.getSavedTopicsId(userId);
        res.status(200).send(bookmark);
    }
    catch (err) {
        next(err);
    }
});
router.get('/saved-for/:userId', middleware_1.default, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const bookmark = await users_services_1.default.getSavedTopics(userId);
        res.status(200).send(bookmark);
    }
    catch (err) {
        next(err);
    }
});
router.post('/xfollow', middleware_1.default, async (req, res, next) => {
    try {
        const { fedId, fingId } = req.body;
        const xfollow = await users_services_1.default.createFollows(fedId, fingId);
        res.status(200).json(xfollow);
    }
    catch (err) {
        next(err);
    }
});
router.get('/follows/for/:followerId', async (req, res, next) => {
    try {
        const { followerId } = req.params;
        const following = await users_services_1.default.whoIFollow(followerId);
        res.status(200).json(following);
    }
    catch (err) {
        next(err);
    }
});
router.get('/follows/to/:followingId', middleware_1.default, async (req, res, next) => {
    try {
        const { followingId } = req.params;
        const follower = await users_services_1.default.myFollowers(followingId);
        res.status(200).json(follower);
    }
    catch (err) {
        next(err);
    }
});
router.get('/liked/for/:userId', middleware_1.default, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const liked = await users_services_1.default.getLikedArticle(userId);
        res.status(200).json(liked);
    }
    catch (err) {
        next(err);
    }
});
router.get('/exists/:email', middleware_1.default, async (req, res, next) => {
    try {
        const { email } = req.params;
        const exist = await users_services_1.default.exists(email);
        res.status(exist ? 200 : 404).json(exist);
    }
    catch (err) {
        next(err);
    }
});
router.post('/delete', middleware_1.default, async (req, res, next) => {
    try {
        const { userId } = req.body;
        await users_services_1.default.deleteUser(userId);
        res.json({ message: 'Account deleted Successfully' });
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=users.routes.js.map