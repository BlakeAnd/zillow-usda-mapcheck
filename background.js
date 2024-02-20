chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "checkEligibility") {
      const url = `https://eligibility.sc.egov.usda.gov/eligibility/MapAddressVerification?address=${request.address}&whichapp=SFHMFS`;
      // https://eligibility.sc.egov.usda.gov/eligibility/MapAddressVerification?address=575%20SW%20G%20St,%20Grants%20Pass,%20OR%2097526&whichapp=SFHMFS
      fetch(url)
        .then(response => response.text())
        .then(data => sendResponse({data: data}))
        .catch(error => console.error('Error:', error));
      return true; // Keep the messaging channel open for async response
    }
  }
);