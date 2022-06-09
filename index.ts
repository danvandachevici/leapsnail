import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app: Express = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const port = process.env.PORT || 3000;

interface KidSaid {
  kid: string;
  when: Date;
  context: string;
  said: string;
}
const urls = {
  g: (query: string, tokens: string[]): string =>
    'https://google.com/search?q=' + tokens.join(' '),
  yt: (query: string, tokens: string[]): string =>
    'https://www.youtube.com/results?search_query=' + tokens.join(' '),
};
const commands = {
  kidsaid: (query: string, tokens: string[]) => {
    const [kid, ...said] = tokens;
    return `/kid-said?kid=${kid}&said=${encodeURIComponent(said.join(' '))}`;
  },
};
const maps: any = {
  g: urls.g,
  yt: urls.yt,
  set: (query: string, tokens: string[]) => cache._set(query),
  kidsaid: commands.kidsaid,
};

class WriteThroughCache {
  private _cache: any;
  private _cachePermanentStorageFileName: string = 'cacheBackup';
  constructor() {
    this._init();
  }

  private _init() {
    const savedCache = fs.readFileSync(this._cachePermanentStorageFileName);
    this._cache = savedCache;
  }

  _set(query: string) {
    return 0;
  }

  get() {}
}

const cache = new WriteThroughCache();

app.get('/success', (req: Request, res: Response) => {
  res.set('content-type', 'text/html');
  res.send(
    '<img src="https://i.ytimg.com/vi/Qj1JdSoV2gc/maxresdefault.jpg" alt="great success" />'
  );
});
app.get('/fail', (req: Request, res: Response) => {
  res.set('content-type', 'text/html');
  res.send(
    'Command failed - no such command, or your command doesnt have a query'
  );
});
app.get('/kid-said', (req: Request, res: Response) => {
  res.set('content-type', 'text/html');
  res.sendFile('./templates/kidsaid.html', { root: __dirname + '/../' });
});
app.post('/kid-said', (req: Request, res: Response) => {
  console.log('GOT KID SAID!!!', req.body);

  const kidSaid: KidSaid = {
    kid: req.body.kid,
    when: req.body.date || new Date(),
    context: req.body.context,
    said: req.body.said,
  };
  res.set('content-type', 'text/html');
  res.send(`<h1>${kidSaid.kid} said: ${kidSaid.said}</h1>`);
});

app.get('/leapsnail', (req: Request, res: Response) => {
  console.log('req:', req.query.search);
  const query: string = req.query.search as string;
  const tokens: string[] = query.split(' ');
  if (tokens.length < 1) {
    res.redirect(301, 'http://google.com');
  }
  if (!!maps[tokens[0]]) {
    const [first, ...rest] = tokens;
    const ret = maps[tokens[0]](query, rest);
    if (typeof ret === 'string') {
      res.redirect(301, ret);
      return;
    } else {
      res.redirect(301, '/success');
      return;
    }
  } else {
    const ret = maps.g(query, tokens);
    res.redirect(301, ret);
    return;
  }
});

const fetchConfig = () => {};

// preload cache
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
