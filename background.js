chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("request", request);
    if (request.action == "checkEligibility") {
      const url = `https://eligibility.sc.egov.usda.gov/eligibility/MapAddressVerification?address=${request.address}&whichapp=SFHMFS`;
      fetch(url)
        .then(response => {
          console.log("response", response); // Log the response object
          return response.text(); // Return the text of the response to chain the promise
        })
        .then(data => {
          console.log("data", data); // Log the data
          sendResponse({data: data});
        })
        .catch(error => {
          console.log("error", error); // Log the error
          sendResponse({error: error});
        });
      return true; // Keep the messaging channel open for async response
    }
  }
);


// let lastFrameId = -1;

// chrome.webRequest.onBeforeRequest.addListener(
//   details => {
//       if (details.initiator === "https://www.zillow.com" && details.frameId > lastFrameId) {
//           console.log("GONNA SEND THE MESSAGE TO CONTENT");
//           chrome.tabs.sendMessage(details.tabId, {action: "triggerMain"});
//           lastFrameId = details.frameId;
//       }
//   },
//   { urls: ['<all_urls>'] }
// );

  chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log('Page uses history.pushState or history.replaceState.');
    // consoke.log
    if((details.url.includes("https://www.zillow.com") && details.url.includes("?searchQueryState=")) || details.url.includes("https://www.zillow.com/homes/")){
      chrome.tabs.sendMessage(details.tabId, {action: "urlChanged"})
    }
    else if(details.url.includes("https://www.zillow.com/homedetails/")){
      chrome.tabs.sendMessage(details.tabId, {action: "urlChanged"})
    }
    else if(details.url.includes("https://www.zillow.com/myzillow/favorites")){
      chrome.tabs.sendMessage(details.tabId, {action: "urlChanged"})     
    }
  }, {url: [{urlMatches : 'https://www.zillow.com/*'}]});