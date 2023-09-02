import express from 'express';
import isAuthenticated from '../middleware';
import UsersServices from './users.services';

const router = express.Router();

router.get('/me/:userId', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UsersServices.syncProfile(userId);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/profile/:userId/update',
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { username, bio, socialLinks } = req.body;
      const { userId } = req.params;
      const updatedUser = await UsersServices.resyncProfile({
        userId,
        username,
        bio,
      });
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/saved', isAuthenticated, async (req, res, next) => {
  try {
    const { saved } = req.body;
    const bookmark = await UsersServices.createBookmark(saved);
    res.status(200).send(bookmark);
  } catch (err) {
    next(err);
  }
});

router.get('/saved/ids/:userId', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const bookmark = await UsersServices.getSavedTopicsId(userId);
    res.status(200).send(bookmark);
  } catch (err) {
    next(err);
  }
});

router.get('/saved-for/:userId', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const bookmark = await UsersServices.getSavedTopics(userId);
    res.status(200).send(bookmark);
  } catch (err) {
    next(err);
  }
});

router.post('/xfollow', isAuthenticated, async (req, res, next) => {
  try {
    const { fedId, fingId } = req.body;
    const xfollow = await UsersServices.createFollows(fedId, fingId);
    res.status(200).json(xfollow);
  } catch (err) {
    next(err);
  }
});

router.get('/follows/for/:followerId', async (req, res, next) => {
  try {
    const { followerId } = req.params;
    const following = await UsersServices.whoIFollow(followerId);
    res.status(200).json(following);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/follows/to/:followingId',
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { followingId } = req.params;
      const follower = await UsersServices.myFollowers(followingId);
      res.status(200).json(follower);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/liked/for/:userId', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const liked = await UsersServices.getLikedArticle(userId);
    res.status(200).json(liked);
  } catch (err) {
    next(err);
  }
});

router.get('/exists/:email', isAuthenticated, async (req, res, next) => {
  try {
    const { email } = req.params;
    const exist = await UsersServices.exists(email);
    res.status(exist ? 200 : 404).json(exist);
  } catch (err) {
    next(err);
  }
});

router.post('/delete', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.body;
    await UsersServices.deleteUser(userId);
    res.json({ message: 'Account deleted Successfully' });
  } catch (err) {
    next(err);
  }
});

export { router as default };
