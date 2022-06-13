const urls = {
  g: (query: string, tokens: string[]): string =>
    'https://google.com/search?q=' + encodeURIComponent(tokens.join(' ')),
  yt: (query: string, tokens: string[]): string =>
    'https://www.youtube.com/results?search_query=' + encodeURIComponent(tokens.join(' ')),
  n: (query: string, tokens: string[]): string => 
    'https://www.netflix.com/search?q=' + encodeURIComponent(tokens.join(' ')),
};
export default urls;
