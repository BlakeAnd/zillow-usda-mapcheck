chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "checkEligibility") {
      const url = `https://eligibility.sc.egov.usda.gov/eligibility/MapAddressVerification?address=${request.address}&whichapp=RBSIELG`;
      fetch(url)
        .then(response => response.text())
        .then(data => sendResponse({data: data}))
        .catch(error => console.error('Error:', error));
      return true; // Keep the messaging channel open for async response
    }
  }
);