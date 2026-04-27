function extractPageContent() {
  // Get main content
  const mainContent = document.querySelector('main') || 
                     document.querySelector('article') || 
                     document.querySelector('.content') ||
                     document.body;
  
  // Extract text
  const content = mainContent.innerText || mainContent.textContent || '';
  
  // Extract headings
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
    .map(h => h.innerText.trim())
    .filter(h => h);
  
  // Extract links
  const links = Array.from(document.querySelectorAll('a'))
    .filter(a => a.href && !a.href.startsWith('#') && !a.href.startsWith('javascript:'))
    .map(a => ({
      text: a.innerText.trim(),
      href: a.href
    }))
    .slice(0, 20);
  
  // Extract title
  const title = document.title;
  
  // Extract meta description
  const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
  
  return {
    url: window.location.href,
    title,
    metaDescription,
    content,
    headings,
    links,
    wordCount: content.split(/\s+/).length
  };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    try {
      const pageContent = extractPageContent();
      sendResponse({
        success: true,
        content: pageContent
      });
    } catch (error) {
      sendResponse({
        success: false,
        error: error.message
      });
    }
  }
  return true;
});

console.log('Citify AI content script loaded');
