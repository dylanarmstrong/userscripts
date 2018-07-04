## Tampermonkey Scripts

### Notes
My personal collection of tampermonkey (greasemonkey) scripts. These can all be used independently of each other, so just grab the ones that sound interesting.

### reddit-filter.js
Adds a small (x) next to subreddit names on r/all that hides the subreddit from r/all until removed from localStorage manually. This does not currently work with domain, word, or user filtering.

### reddit-redirect.js
Redirects www calls to old.reddit.com

### reddit-load.js
When you scroll to the bottom, load the next page of results. Compatible with reddit-filter.js.

### spacebattles-popular.js
Hides unpopular stories on spacebattles, so it's easier to go through recently updated and find good stories.

### stylize.js
Allows me to write custom styles for websites matching hosts by string or regex. Not very user friendly and you'd be best off copying the js directly into your add-on and ignoring updates.

```javascript
const csses = {
  '((old|www)\.)?reddit\.com$': {
    type: 'regex',
    css: `
      .subreddit {
        border: 1px solid blue;
      }
    `
  },
  'old.reddit.com': {
    type: 'string',
    css: `
      .subreddit {
        border: 1px solid red;
      }
    `
  }
};
```
