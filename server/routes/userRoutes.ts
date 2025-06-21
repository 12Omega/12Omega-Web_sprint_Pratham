import { Router } from 'express';

const router = Router();

// Define user routes here
router.get('/', (req, res) => {
  res.send('User list');
});

export default router;
