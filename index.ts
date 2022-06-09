import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
app.get('*', (req: Request, res: Response) => {
  console.log('Got request with search term', req.query.search);
  res.redirect(301, "http://google.com/search?q=" + req.query.search);
  res.send()
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
