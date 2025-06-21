import { Router } from 'express';

const router = Router();

// Define product routes here
router.get('/', (req, res) => {
  res.send('Product list');
});

export default router;
