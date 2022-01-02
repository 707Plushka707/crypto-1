import express from 'express';
import {calculatePerformance, compileAssetAllocation, compile} from '../controllers/compiler.js';

const router = express.Router()

router.post('/', compile)
router.post('/performance', calculatePerformance)
router.post('/assetAllocation', compileAssetAllocation);


export default router;