# RSS Search Engine

This repository hosts an RSS-based search engine that indexes and searches articles from RSS feeds. Articles are preserved indefinitely and never automatically deleted.

## Features

- 🔍 **Full-text search** across all indexed articles by title, description, or source
- 💾 **Permanent storage** - articles are never automatically deleted (100-year cache retention)
- 🔄 **Automatic updates** - fetches new articles daily via GitHub Actions
- 📱 **Responsive design** - works on desktop and mobile
- ⚡ **Fast client-side search** - instant results without server queries
- 📊 **Search statistics** - shows number of matching articles

## Configuration

The search engine is configured via `osmosfeed.yaml`:

- **cacheMaxDays**: Set to 36500 (100 years) to effectively never delete articles
- **cacheUrl**: Points to the deployed cache for persistence across builds
- **sources**: List of RSS feeds to index

## How it works

1. GitHub Actions runs daily to fetch new articles from configured RSS feeds
2. Articles are stored in a persistent cache file (`cache.json`)
3. The static site is built with search functionality and deployed to GitHub Pages
4. Users can search through all indexed articles using the search box

## Links and references

- [How does osmosfeed work?](https://github.com/osmoscraft/osmosfeed#osmosfeed)
- [File an issue about the template](https://github.com/osmoscraft/osmosfeed-template)
- [File an issue about the tool](https://github.com/osmoscraft/osmosfeed)
- [Latest documentation](https://github.com/osmoscraft/osmosfeed)
