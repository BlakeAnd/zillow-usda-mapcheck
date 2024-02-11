window.addEventListener('load', function () {
  let zillow_search_box = document.getElementsByClassName("StyledFormControl-c11n-8-86-1__sc-18qgis1-0 DA-dAx Input-c11n-8-86-1__sc-4ry0fw-0 hxjfkY")[0];

  console.log("BEEP BOOP PROGRAM ACTIVATED", zillow_search_box);

  let search_str = "";

  // zillow_search_box.onkeyup = function(e) {
  //   // console.log("typiiiiing")
  //   search_str = zillow_search_box.value;
  //   console.log(search_str);
    
  //   if(zillow_search_box === document.activeElement && e.key === "Enter"){
  //     alert(`entering the search ${search_str}`)
  //   }
  // }

  let zillow_search_button = document.getElementsByClassName("StyledAdornment-c11n-8-86-1__sc-1kerx9v-0 AdornmentRight-c11n-8-86-1__sc-1kerx9v-2 ddthKA ecdnJo SearchBox__StyledSearchBoxAdornment-rxevgz-0 gXdUka")[0];


  let url_start = "https://eligibility.sc.egov.usda.gov/eligibility/MapAddressVerification?address="
  // 370%20boyer%20rd
  let url_end = "&whichapp=RBSIELG"
  // zillow_search_button.onclick 
  check_eligibility();
  function check_eligibility() {
    let url_search_str = search_str.replaceAll(" ", "%20");

    // URL of the page you want to fetch
    url_search_str = "370%20boyer%20rd"
    const url = url_start + url_search_str + url_end;

    console.log(url)
    // alert(`clicking the search ${url}`)

    let address = "370%20boyer%20rd"; // Example, get this from your page interactions
    let eligibility_response = "";
    chrome.runtime.sendMessage({
      action: "checkEligibility",
      address: address
    }, response => {
      console.log('Eligibility data:', response.data);
      eligibility_response = JSON.parse(response.data);
      console.log("eligible?", eligibility_response.eligibilityResult);
      // alert(response.data);
    });

    // Use fetch to get the content
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const targetUrl = "https://eligibility.sc.egov.usda.gov/eligibility/MapAddressVerification?address=370%20boyer%20rd&whichapp=RBSIELG"; // The URL you want to fetch
  // fetch(`${proxyUrl}${targetUrl}`)
  // .then(response => response.text())
  // .then(data => console.log(data))
  // .catch(error => console.error('Error:', error));
    // fetch(`${targetUrl}`)
    //   .then(response => {
    //     // Check if the request was successful
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     // Return the text content of the response
    //     return response.text();
    //   })
    //   .then(data => {
    //     // 'data' contains the content of the webpage
    //     alert(data)
    //     console.log(data);
    //   })
    //   .catch(error => {
    //     // Handle any errors that occurred during the fetch
    //     alert(error)
    //     console.error('Fetch error:', error);
    //   });

      

  }

  // document.onclick = function(){
  //   console.log("something WAS clicked!");
  //   console.log(zillow_search_box);
  //   console.log("ELLO!");
  //   console.log(document.activeElement);

  //   if (zillow_search_box === document.activeElement) {
      
  //     console.log("FOCUSSED")
  //     document.onkeypress = function() {
  //       let str = document.activeElement.value;
  //       console.log(str)
  //     }
  //   }
  //   else{
  //     console.log("no focus!")
  //   }

  // };


})