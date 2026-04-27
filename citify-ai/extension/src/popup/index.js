document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const suggestionsDiv = document.getElementById('suggestions');
  
  // Get current tab and analyze content
  analyzeBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url || tab.url.startsWith('chrome://')) {
      alert('Cannot analyze this page');
      return;
    }
    
    // Show loading state
    analyzeBtn.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;
    
    // Inject content script to extract page content
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/content/index.js']
      });
      
      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'analyzePage'
      });
      
      if (response && response.content) {
        // Simulate analysis with mock data
        displayAnalysisResults(response.content);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      suggestionsDiv.innerHTML = '<p class="placeholder">Analysis failed. Please try again.</p>';
    } finally {
      analyzeBtn.textContent = 'Analyze Page';
      analyzeBtn.disabled = false;
    }
  });
  
  // Display mock analysis results
  function displayAnalysisResults(content) {
    const wordCount = content.split(/\s+/).length;
    const mockSuggestions = [
      { icon: '💡', text: 'Add more data and statistics to improve credibility' },
      { icon: '📝', text: 'Improve heading structure with H2 and H3 tags' },
      { icon: '🔗', text: 'Add external links to authoritative sources' },
      { icon: '📊', text: 'Include more list-based content for better readability' }
    ];
    
    // Update RAG score
    const scoreValue = document.querySelector('.score-value');
    const scoreCircle = document.querySelector('.score-circle');
    const score = Math.floor(Math.random() * 30) + 60;
    scoreValue.textContent = score;
    
    if (score >= 80) {
      scoreCircle.style.borderColor = '#10b981';
      scoreValue.style.color = '#10b981';
    } else if (score >= 60) {
      scoreCircle.style.borderColor = '#f59e0b';
      scoreValue.style.color = '#f59e0b';
    } else {
      scoreCircle.style.borderColor = '#ef4444';
      scoreValue.style.color = '#ef4444';
    }
    
    // Update quick stats
    const stats = document.querySelectorAll('.stat-value');
    stats[0].textContent = wordCount.toLocaleString();
    stats[1].textContent = Math.floor(Math.random() * 10) + 3;
    stats[2].textContent = Math.floor(Math.random() * 15) + 5;
    
    // Display suggestions
    suggestionsDiv.innerHTML = mockSuggestions.map(s => `
      <div class="suggestion-item">
        <span class="suggestion-icon">${s.icon}</span>
        <span class="suggestion-text">${s.text}</span>
      </div>
    `).join('');
  }
  
  // Open dashboard button
  const actionButtons = document.querySelectorAll('.btn-secondary');
  actionButtons[actionButtons.length - 1].addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' });
  });
});
