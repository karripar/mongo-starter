import express from 'express';
import { postCategory, getCategories, getCategoryById, modifyCategory, deleteCategory} from '../controllers/categoryController';

const router = express.Router();

router.route('/').post(postCategory).get(getCategories);

router.route('/:id').get(getCategoryById).put(modifyCategory).delete(deleteCategory);

export default router;
