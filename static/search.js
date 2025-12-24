// Search functionality for RSS Search Engine
(function() {
  'use strict';

  const searchInput = document.getElementById('search-input');
  const searchStats = document.getElementById('search-stats');
  const content = document.getElementById('content');
  
  let allArticles = [];
  let totalArticleCount = 0;

  // Initialize search
  function init() {
    // Cache all articles for searching
    allArticles = Array.from(document.querySelectorAll('article'));
    totalArticleCount = allArticles.length;
    
    // Extract searchable data from each article
    allArticles.forEach(article => {
      const titleElement = article.querySelector('.article-expander__title');
      const descriptionElement = article.querySelector('.media-object__text span:first-child');
      const sourceElement = article.closest('.card__section')?.querySelector('.source-heading__name');
      
      article._searchData = {
        title: titleElement?.textContent?.toLowerCase() || '',
        description: descriptionElement?.textContent?.toLowerCase() || '',
        source: sourceElement?.textContent?.toLowerCase() || ''
      };
    });
    
    updateSearchStats(totalArticleCount, totalArticleCount);
    
    // Add event listener for search input
    searchInput.addEventListener('input', handleSearch);
    
    // Handle URL hash for search query
    if (window.location.hash) {
      const query = decodeURIComponent(window.location.hash.substring(1));
      searchInput.value = query;
      handleSearch();
    }
  }

  // Perform search
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    // Update URL hash
    if (query) {
      window.location.hash = encodeURIComponent(query);
    } else {
      window.history.replaceState(null, null, ' ');
    }
    
    if (!query) {
      showAllArticles();
      return;
    }
    
    let visibleCount = 0;
    const sections = document.querySelectorAll('.daily-content');
    
    allArticles.forEach(article => {
      const data = article._searchData;
      
      const matches = data.title.includes(query) || 
                     data.description.includes(query) || 
                     data.source.includes(query);
      
      if (matches) {
        article.style.display = '';
        visibleCount++;
        
        // Expand matching articles
        const details = article.querySelector('details');
        if (details) {
          details.open = true;
        }
      } else {
        article.style.display = 'none';
      }
    });
    
    // Hide/show sections and sources based on visible articles
    sections.forEach(section => {
      const visibleArticlesInSection = Array.from(section.querySelectorAll('article'))
        .filter(article => article.style.display !== 'none');
      
      if (visibleArticlesInSection.length === 0) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
        
        // Hide/show sources within section
        const sources = section.querySelectorAll('.card__section');
        sources.forEach(source => {
          const visibleArticlesInSource = Array.from(source.querySelectorAll('article'))
            .filter(article => article.style.display !== 'none');
          
          if (visibleArticlesInSource.length === 0) {
            source.style.display = 'none';
          } else {
            source.style.display = '';
          }
        });
      }
    });
    
    updateSearchStats(visibleCount, totalArticleCount);
  }

  // Show all articles
  function showAllArticles() {
    allArticles.forEach(article => {
      article.style.display = '';
    });
    
    const sections = document.querySelectorAll('.daily-content');
    sections.forEach(section => {
      section.style.display = '';
      const sources = section.querySelectorAll('.card__section');
      sources.forEach(source => {
        source.style.display = '';
      });
    });
    
    updateSearchStats(totalArticleCount, totalArticleCount);
  }

  // Update search statistics
  function updateSearchStats(visible, total) {
    if (visible === total) {
      searchStats.textContent = `Showing all ${total} articles`;
    } else {
      searchStats.textContent = `Found ${visible} of ${total} articles`;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
