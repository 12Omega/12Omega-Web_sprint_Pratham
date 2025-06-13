import express, { Request, Response } from 'express';

const app = express(); // ✅ Now `app` is defined

app.get('/users', (req: Request, res: Response) => {
  res.json({ users: [] });
});

