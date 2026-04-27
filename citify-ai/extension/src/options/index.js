document.addEventListener('DOMContentLoaded', () => {
  const apiUrlInput = document.getElementById('apiUrl');
  const apiKeyInput = document.getElementById('apiKey');
  const autoAnalyzeInput = document.getElementById('autoAnalyze');
  const defaultIndustryInput = document.getElementById('defaultIndustry');
  const showNotificationsInput = document.getElementById('showNotifications');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const statusMessage = document.getElementById('statusMessage');
  
  // Load saved settings
  loadSettings();
  
  // Save settings
  saveBtn.addEventListener('click', async () => {
    const settings = {
      apiUrl: apiUrlInput.value,
      apiKey: apiKeyInput.value,
      autoAnalyze: autoAnalyzeInput.checked,
      defaultIndustry: defaultIndustryInput.value,
      showNotifications: showNotificationsInput.checked
    };
    
    try {
      await chrome.storage.local.set(settings);
      showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      showStatus('Failed to save settings', 'error');
    }
  });
  
  // Reset to defaults
  resetBtn.addEventListener('click', () => {
    apiUrlInput.value = 'http://localhost:8000/api/v1';
    apiKeyInput.value = '';
    autoAnalyzeInput.checked = false;
    defaultIndustryInput.value = '';
    showNotificationsInput.checked = true;
  });
  
  async function loadSettings() {
    try {
      const settings = await chrome.storage.local.get([
        'apiUrl',
        'apiKey',
        'autoAnalyze',
        'defaultIndustry',
        'showNotifications'
      ]);
      
      apiUrlInput.value = settings.apiUrl || 'http://localhost:8000/api/v1';
      apiKeyInput.value = settings.apiKey || '';
      autoAnalyzeInput.checked = settings.autoAnalyze || false;
      defaultIndustryInput.value = settings.defaultIndustry || '';
      showNotificationsInput.checked = settings.showNotifications !== false;
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }
  
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
    
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 3000);
  }
});
