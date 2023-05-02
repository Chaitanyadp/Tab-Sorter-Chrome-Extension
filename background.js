chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Sorter installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

chrome.runtime.onConnect.addListener((port) => {
  console.log('Connected to popup');

  port.onMessage.addListener((message) => {
    console.log(`Received message: ${message}`);

    if (message === 'sort-tabs') {
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        tabs.sort((a, b) => {
          const domainA = getDomain(a.url);
          const domainB = getDomain(b.url);
          return domainA.localeCompare(domainB);
        });

        const tabIds = tabs.map((tab) => tab.id);
        chrome.tabs.move(tabIds, { index: -1 });
      });
    }
  });
});

function getDomain(url) {
  const hostname = new URL(url).hostname;
  return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
}