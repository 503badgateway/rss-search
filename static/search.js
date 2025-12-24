// Search functionality for RSS Search Engine
(function() {
  'use strict';

  const searchInput = document.getElementById('search-input');
  const searchStats = document.getElementById('search-stats');
  
  let allArticles = [];
  let totalArticleCount = 0;
  let currentPage = 1;
  const itemsPerPage = 20;
  let filteredArticles = [];

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
      const timeElement = article.querySelector('time');
      
      article._searchData = {
        title: titleElement?.textContent?.toLowerCase() || '',
        description: descriptionElement?.textContent?.toLowerCase() || '',
        source: sourceElement?.textContent?.toLowerCase() || '',
        timestamp: timeElement?.getAttribute('datetime') || ''
      };
    });
    
    // Sort articles by timestamp (newest first)
    allArticles.sort((a, b) => {
      const timeA = a._searchData.timestamp ? new Date(a._searchData.timestamp) : new Date(0);
      const timeB = b._searchData.timestamp ? new Date(b._searchData.timestamp) : new Date(0);
      return timeB - timeA;
    });
    
    // Create pagination controls
    createPaginationControls();
    
    // Add event listener for search input
    searchInput.addEventListener('input', handleSearch);
    
    // Handle URL hash for search query
    if (window.location.hash) {
      const query = decodeURIComponent(window.location.hash.substring(1));
      searchInput.value = query;
      handleSearch();
    } else {
      // Show only newest 20 articles initially
      showNewestArticles();
    }
  }

  // Perform search
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    // Update URL hash
    if (query) {
      window.location.hash = encodeURIComponent(query);
    } else {
      // Clear hash without adding space to URL
      history.replaceState(null, null, window.location.href.split('#')[0]);
    }
    
    if (!query) {
      showNewestArticles();
      return;
    }
    
    // Reset to first page on new search
    currentPage = 1;
    
    // Filter articles based on query
    filteredArticles = allArticles.filter(article => {
      const data = article._searchData;
      return data.title.includes(query) || 
             data.description.includes(query) || 
             data.source.includes(query);
    });
    
    // Display paginated results
    displayPaginatedArticles(filteredArticles);
  }

  // Show newest 20 articles
  function showNewestArticles() {
    currentPage = 1;
    filteredArticles = allArticles.slice(0, itemsPerPage);
    displayPaginatedArticles(filteredArticles, true);
  }
  
  // Display paginated articles
  function displayPaginatedArticles(articles, isHomePage = false) {
    const sections = document.querySelectorAll('.daily-content');
    
    // Hide all articles first
    allArticles.forEach(article => {
      article.style.display = 'none';
    });
    
    // Calculate pagination
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageArticles = articles.slice(startIndex, endIndex);
    
    // Show articles for current page
    let visibleCount = 0;
    pageArticles.forEach(article => {
      article.style.display = '';
      visibleCount++;
      
      // Expand matching articles for search results
      if (!isHomePage) {
        const details = article.querySelector('details');
        if (details) {
          details.open = true;
        }
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
    
    // Update stats and pagination
    if (isHomePage) {
      updateSearchStats(visibleCount, totalArticleCount, totalPages, false);
    } else {
      updateSearchStats(visibleCount, articles.length, totalPages, true);
    }
    updatePaginationControls(totalPages);
  }

  // Create pagination controls
  function createPaginationControls() {
    const paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination-controls';
    paginationContainer.className = 'pagination-controls';
    
    const content = document.getElementById('content');
    if (content) {
      content.appendChild(paginationContainer);
    }
  }
  
  // Update pagination controls
  function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById('pagination-controls');
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '← Previous';
    prevButton.className = 'pagination-button';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        displayPaginatedArticles(filteredArticles, !searchInput.value.trim());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    paginationContainer.appendChild(prevButton);
    
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.className = 'pagination-info';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next →';
    nextButton.className = 'pagination-button';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayPaginatedArticles(filteredArticles, !searchInput.value.trim());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    paginationContainer.appendChild(nextButton);
  }
  
  // Update search statistics
  function updateSearchStats(visible, total, totalPages, isSearchResult) {
    if (isSearchResult) {
      const startIndex = (currentPage - 1) * itemsPerPage + 1;
      const endIndex = Math.min(currentPage * itemsPerPage, total);
      searchStats.textContent = `Found ${total} articles, showing ${startIndex}-${endIndex}`;
    } else {
      searchStats.textContent = `Showing newest ${visible} of ${total} articles`;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
