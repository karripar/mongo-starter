import express from 'express';
import { postCategory, getCategories, getCategoryById} from '../controllers/categoryController';

const router = express.Router();

router.route('/').post(postCategory).get(getCategories);

router.route('/:id').get(getCategoryById).put().delete();

export default router;
