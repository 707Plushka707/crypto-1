import express from 'express';
import {setApiKeys, getProfileData, getUsers, getTradeHistory} from '../controllers/users.js';

const router = express.Router()

router.get('/', getUsers);
router.get('/profileData/:username', getProfileData);
router.get('/tradeHistory/:id/:limit', getTradeHistory);
router.patch('/keys', setApiKeys);

export default router