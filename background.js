'use strict';

// Add an event listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Remove any existing rules and add a new rule to show the page action
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      // Show the page action when the URL of the page contains "datonis.io"
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlContains: 'datonis.io' },
        })
      ],
      // Show the extension's page action
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});

// Enable or disable the page action icon depending on the URL of the active tab
function updatePageAction(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab && tab.url && tab.url.includes('datonis.io')) {
      chrome.action.enable(tabId);
      chrome.action.setIcon({ path: 'assets/preview_enabled-32.png' });
    } else {
      chrome.action.disable(tabId);
      chrome.action.setIcon({ path: 'assets/preview_disabled-32.png' });
    }
  });
}

// Listen for tab updates and update the page action icon accordingly
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    updatePageAction(tabId);
  }
});

// Add an event listener for when the page action button is clicked
chrome.action.onClicked.addListener((tab) => {
  // If the tab's URL already contains "preview=true", do nothing
  if (tab.url.includes('preview=true')) {
    return;
  }
  // Get the current URL and add the "preview=true" parameter
  let url = new URL(tab.url);
  url.searchParams.set('preview', 'true');
  // Update the tab's URL with the new parameter
  chrome.tabs.update(tab.id, { url: url.href });
});