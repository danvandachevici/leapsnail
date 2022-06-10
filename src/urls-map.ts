const urls = {
  g: (query: string, tokens: string[]): string =>
    'https://google.com/search?q=' + tokens.join(' '),
  yt: (query: string, tokens: string[]): string =>
    'https://www.youtube.com/results?search_query=' + tokens.join(' '),
};
export default urls;
