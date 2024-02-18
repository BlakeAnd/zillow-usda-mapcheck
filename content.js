window.addEventListener('load', function () {
  // let zillow_search_box = document.getElementsByClassName("StyledFormControl-c11n-8-86-1__sc-18qgis1-0 DA-dAx Input-c11n-8-86-1__sc-4ry0fw-0 hxjfkY")[0];


  // Select the specific <ul>
  const propertiesList = document.querySelector('.List-c11n-8-84-3__sc-1smrmqp-0'); // StyledSearchListWrapper-srp__sc-1ieen0c-0 doa-doM gKnRas photo-cards photo-cards_extra-attribution

  console.log("BEEP BOOP PROGRAM ACTIVATED", propertiesList);


  // Select all <li> elements within this <ul>
  const listItems = document.getElementsByTagName('address');
  const priceListItems = this.document.getElementsByClassName("PropertyCardWrapper__StyledPriceLine-srp__sc-16e8gqd-1 iMKTKr");
  let addresses_arr = [];
  setAddressesArray();

  async function updateAddressesAndDisplayTagsInitial() {
    addresses_arr = setAddressesArray();
    addresses_arr = await sendAllAddresses(addresses_arr);
    createEligibilityDisplayTags(addresses_arr);
  }
  
  updateAddressesAndDisplayTagsInitial();
  
  async function sendAllAddresses(addresses) {
    // Use Promise.all to wait for all the sendAddress promises to resolve
    await Promise.all(addresses.map(async (addressObj) => {
      let server_response = await sendAddress(addressObj.url_address);
      addressObj.USDA_response = server_response;
    }));
    console.log("addresses obj after response", addresses);
    return addresses;
  }
  
  function sendAddress(url_address) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: "checkEligibility",
        address: url_address
      }, response => {
        if (response) {
          let eligibility_response = JSON.parse(response.data);
          resolve(eligibility_response);
        } else {
          reject(new Error("No response from server"));
        }
      });
    });
  }
  
  function createEligibilityDisplayTags(addresses_arr) {
    console.log("addresses @ display func", addresses_arr, priceListItems);
    for (let i = 0; i < priceListItems.length; i++) {
      // Create a new span element to display the eligibility
      let span = document.createElement('span');
  
      // Set the text content of the span to the eligibility information
      // from the corresponding address in addresses_arr
      console.log("alleged content of response", addresses_arr[i].USDA_response.eligibilityResult);
      span.textContent = addresses_arr[i].USDA_response.eligibilityResult;
      console.log("alleged content of span", span.textContent);
  
      // Append the span element to the current list item
      priceListItems[i].appendChild(span);
    }
  }

  // addresses_arr = setAddressesArray() ;
  // addresses_arr = sendAllAddresses(addresses_arr);
  // createEligibilityDisplayTags(addresses_arr)


  // function sendAllAddresses(addresses) {
  //   addresses.forEach(async (addressObj) => {
  //     let server_response = await sendAddress(addressObj.url_address);
  //     // console.log("RES", server_response);
  //     addressObj.USDA_response = server_response;
  //   });
  //   console.log("addresses obj after response", addresses);
  //   return addresses;
  // }
  
  // function sendAddress(url_address) {
  //   return new Promise((resolve, reject) => {
  //     chrome.runtime.sendMessage({
  //       action: "checkEligibility",
  //       address: url_address
  //     }, response => {
  //       if (response) {
  //         let eligibility_response = JSON.parse(response.data);
  //         resolve(eligibility_response);
  //       } else {
  //         reject(new Error("No response from server"));
  //       }
  //     });
  //   });
  // }

  // function createEligibilityDisplayTags (addresses_arr) {
  //   console.log("addresses @ display func", addresses_arr, listItems)
  //   for(let i = 0; i < listItems.length; i++){
  //     // Create a new span element to display the eligibility
  //     let span = document.createElement('span');

  //     // Set the text content of the span to the eligibility information
  //     // from the corresponding address in addresses_arr
  //     console.log("alleged content of response", addresses_arr[i])
  //     // span.textContent = addresses_arr[i].USDA_response.eligibilityResult;
  //     console.log("alleged content of span", span.textContent)

  //     // Append the span element to the current list item
  //     listItems[i].appendChild(span);
  //   }
  // }

  // function sendAllAddresses(addresses) {
  //   for(let i = 0; i < addresses.length; i++){
  //     let server_response = sendAddress(addresses[i].url_address);
  //     console.log("RES", server_response)
  //     addresses[i].USDA_response = server_response;
  //   }
  //   console.log("addresses obj after esponse", addresses)
  // }

  // function sendAddress(url_address){
  //   let address = url_address; // Example, get this from your page interactions
  //   let eligibility_response = "";
  //   chrome.runtime.sendMessage({
  //     action: "checkEligibility",
  //     address: address
  //   }, response => {
  //     // console.log('Eligibility data:', response.data);
  //     eligibility_response = JSON.parse(response.data);
  //     // console.log("eligible?", eligibility_response.eligibilityResult);
  //     // alert(response.data);
  //     return eligibility_response;
  //   });
    
  // }


  function setAddressesArray(){
    let returned_addresses_array = [];

    for(let i = 0; i < listItems.length; i++){
      let addresses_obj = {
        address: "",
        url_address: "", 
        USDA_response: null,
      }
      addresses_obj.address = listItems[i].innerHTML;
      addresses_obj.url_address = addresses_obj.address.replace(/ /g, "%20");
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
 


  // let url_start = "https://eligibility.sc.egov.usda.gov/eligibility/MapAddressVerification?address="
  // // 370%20boyer%20rd
  // let url_end = "&whichapp=RBSIELG"
  // // zillow_search_button.onclick 
  // check_eligibility();
  // function check_eligibility() {
  //   // let url_search_str = search_str.replaceAll(" ", "%20");

  //   // // URL of the page you want to fetch
  //   // url_search_str = "370%20boyer%20rd"
  //   // const url = url_start + url_search_str + url_end;

  //   // console.log(url)
  //   // // alert(`clicking the search ${url}`)






      

  // }

})