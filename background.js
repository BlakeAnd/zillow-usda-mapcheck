chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("request", request);
    if (request.action == "checkEligibility") {
      const url = `https://eligibility.sc.egov.usda.gov/eligibility/MapAddressVerification?address=${request.address}&whichapp=SFHMFS`;
      fetch(url)
        .then(response => response.text())
        .then(data => {
          // Simulate a delay by using setTimeout
          setTimeout(() => {
            console.log("data", data); // Log the data
            sendResponse({data: data});
          }, 4000); // Delay of 4 seconds
        })
        .catch(error => {
          console.log("error", error); // Log the error
          sendResponse({error: error});
        });
      return true; // Keep the messaging channel open for async response
    }
  }
);


chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  console.log('Page uses history.pushState or history.replaceState.', details.url);
  if ((details.url.includes("https://www.zillow.com") && details.url.includes("?searchQueryState=")) ||
    details.url.includes("https://www.zillow.com/homedetails/") ||
    details.url.includes("https://www.zillow.com/myzillow/favorites") ||
    (details.url.includes("https://www.zillow.com/homes/") && details.url.includes("_zpid"))  
    ) {
    chrome.tabs.sendMessage(details.tabId, { action: "urlChanged" });
  } 

}, { url: [{ urlMatches: 'https://www.zillow.com/*' }] });
