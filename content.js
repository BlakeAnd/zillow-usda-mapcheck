window.addEventListener('load', function () {
  // let zillow_search_box = document.getElementsByClassName("StyledFormControl-c11n-8-86-1__sc-18qgis1-0 DA-dAx Input-c11n-8-86-1__sc-4ry0fw-0 hxjfkY")[0];


  // Select the specific <ul>
  const propertiesList = document.querySelector('.List-c11n-8-84-3__sc-1smrmqp-0'); // StyledSearchListWrapper-srp__sc-1ieen0c-0 doa-doM gKnRas photo-cards photo-cards_extra-attribution

  console.log("BEEP BOOP PROGRAM ACTIVATED", propertiesList);


  // Select all <li> elements within this <ul>
  const listItems = document.getElementsByTagName('address');
  let addresses_arr = setAddressesArray();

  function setAddressesArray(){
    let returned_addresses_array = [];

    for(let i = 0; i < listItems.length; i++){
      let addresses_obj = {
        address: "",
        address_url: ""
      }
      addresses_obj.address = listItems[i].innerHTML;
      addresses_obj.address_url = addresses_obj.address.replace(/ /g, "%20");
      returned_addresses_array.push(addresses_obj);
    }
    return returned_addresses_array;
  }

  console.log("addresses", listItems, addresses_arr)
  // Loop through the <li> elements using a for loop
  for(let i = 0; i < listItems.length; i++) {
      console.log("woot", i, listItems[i].innerHTML); // Or any operation you want to perform
  }


  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}


const throttledScroll = throttle(function() {
    console.log('Throttled scroll event triggered', listItems);
    let old_array_length = addresses_arr.length;
    addresses_arr = setAddressesArray();
    let newly_loaded_arr = addresses_arr.slice(old_array_length)
    
}, 200); // Trigger at most once every 200ms (1/5th of a second)

// window.addEventListener('scroll', throttledScroll);

  const scrollArea = document.querySelector('#search-page-list-container')
  console.log("where it scrolls", scrollArea)

  scrollArea.addEventListener('scroll', throttledScroll);
  // function() {
  //   // Your function code here
  //   console.log('Properties being scrolled');
  // });
 


  let url_start = "https://eligibility.sc.egov.usda.gov/eligibility/MapAddressVerification?address="
  // 370%20boyer%20rd
  let url_end = "&whichapp=RBSIELG"
  // zillow_search_button.onclick 
  check_eligibility();
  function check_eligibility() {
    // let url_search_str = search_str.replaceAll(" ", "%20");

    // // URL of the page you want to fetch
    // url_search_str = "370%20boyer%20rd"
    // const url = url_start + url_search_str + url_end;

    // console.log(url)
    // // alert(`clicking the search ${url}`)

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




      

  }

})