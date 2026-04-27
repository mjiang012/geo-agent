chrome.runtime.onInstalled.addListener(() => {
  console.log('Citify AI extension installed');
  chrome.storage.local.set({
    apiUrl: 'http://localhost:8000/api/v1',
    autoAnalyze: false
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.action.openPopup();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'log') {
    console.log('Extension log:', request.message);
  }
  sendResponse({ received: true });
});
