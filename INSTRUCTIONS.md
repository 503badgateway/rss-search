# Post-Deployment Instructions

After the first successful deployment of this RSS search engine to GitHub Pages, you need to enable cache persistence:

## Enable Cache URL

1. Wait for the GitHub Actions workflow to complete and deploy the site to GitHub Pages
2. Verify that `https://503badgateway.github.io/rss-search/cache.json` is accessible
3. Uncomment the `cacheUrl` line in `osmosfeed.yaml`:
   ```yaml
   cacheUrl: https://503badgateway.github.io/rss-search/cache.json
   ```
4. Commit and push the change

This will ensure that the cache is persisted across builds and articles are never lost.

## How the Cache Works

- **Without cacheUrl**: Each build starts with the local cache from the previous build
- **With cacheUrl**: Each build fetches the deployed cache first, ensuring continuity even if the local cache is lost

## Testing the Search Engine

1. Open your deployed site: `https://503badgateway.github.io/rss-search/`
2. Type in the search box to filter articles
3. Articles should appear/disappear based on your search query
4. The search works across:
   - Article titles
   - Article descriptions
   - Source names

## Monitoring

- Check the GitHub Actions runs to see when new articles are fetched
- The cache file shows all indexed articles with their metadata
- Articles older than 100 years will be removed (effectively never in practice)
