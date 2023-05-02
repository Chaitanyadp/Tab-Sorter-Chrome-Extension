document.addEventListener('DOMContentLoaded', function() {
  const sortBtn = document.getElementById('sortBtn');
  
  sortBtn.addEventListener('click', function() {
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      const groups = {};
      for (let i = 0; i < tabs.length; i++) {
        const domain = extractDomain(tabs[i].url);
        if (!groups[domain]) {
          groups[domain] = [];
        }
        groups[domain].push(tabs[i].id);
      }

      const sortedTabs = [];
      for (const domain in groups) {
        sortedTabs.push(...groups[domain]);
      }

      chrome.tabs.move(sortedTabs, { index: -1 });
    });
  });
});

function extractDomain(url) {
  const domain = url.match(/:\/\/(.[^/]+)/)[1];
  if (domain.indexOf('www.') !== -1) {
    return domain.replace('www.', '');
  }
  return domain;
}