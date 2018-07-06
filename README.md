## Tampermonkey Scripts

### Notes
My personal collection of tampermonkey scripts. These can all be used independently of each other, so just grab the ones that sound interesting. I primarily use Safari, and haven't tested any of these in other browsers. If you run into issues, please open an issue.

### reddit-filter.js
Adds a filter at end of tagline that has a popup to filter on subreddit, domain, or user (only on r/all). They're stored in the localStorage keys starting with 'filter'. Filtered items must be removed from localStorage manually.

![reddit-filter.js screenshot](./screenshots/reddit-filter.png)

### reddit-load.js
When you scroll to the bottom, load the next page of results. Compatible with reddit-filter.js.

### reddit-override.js
Override Reddit's official window.r functionality that *may* be interesting, I don't really know. The isMobile method stops video pinning though, which is useful.

### reddit-redirect.js
Redirects www calls to old.reddit.com

### xenforo-popular.js
Hides unpopular stories on spacebattles / sufficientvelocity, so it's easier to go through recently updated and find good stories.

### stylize.js
Allows me to write custom styles for websites matching hosts by string or regex. Not very user friendly and you'd be best off copying the js directly into your tampermonkey extension and ignoring updates.

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
