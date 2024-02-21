window.addEventListener('load', function () {
getEventElement();   
 main();
})



// Add the click event listener to the search box
function getEventElement () {
  let search_box = document.getElementsByClassName("StyledFormControl-c11n-8-84-3__sc-18qgis1-0 iUiTrf Input-c11n-8-84-3__sc-4ry0fw-0 cevglR");
  search_box = search_box[0];
  console.log(search_box)
  if (search_box){
    // search_box.addEventListener('click', function(event) {
    //   clickedSearchSuggestion(event, search_box);
    // });

    search_box.addEventListener('click', (event) => clickedSearchSuggestion(event, search_box));
    
    document.addEventListener('keydown', (event) => enteredSearch(event, search_box))
  }
}

function enteredSearch (event, search_box) {
  console.log("enter key", event.key)
  // let search_box = document.getElementsByClassName("StyledFormControl-c11n-8-84-3__sc-18qgis1-0 iUiTrf Input-c11n-8-84-3__sc-4ry0fw-0 cevglR")[0]; // Access the first element
  if (event.key === 'Enter' && document.activeElement === search_box) {
    awaitChanges();
  }
}

function clickedSearchSuggestion(event, parentElement) {
  console.log("clicked!")
  const clickedElement = event.target; // The actual element that was clicked
  if (clickedElement !== parentElement) { // Check if the click was not directly on the parent
    awaitChanges(); // Call your main function
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "triggerMain") {
      console.log("MESSAGE")
      main(); // Call the main() function
  }
});

function awaitChanges() {
  const parentSelector = '#grid-search-results'
  // '.List-c11n-8-84-3__sc-1smrmqp-0 StyledSearchListWrapper-srp__sc-1ieen0c-0 doa-doM gKnRas photo-cards photo-cards_extra-attribution';
  let parentElement = document.querySelector(parentSelector);

  const intervalId = setInterval(() => {


      parentElement = document.querySelector(parentSelector);
      console.log("INTERAVL FIRE")
      console.log(parentElement)
      if (parentElement) {
          clearInterval(intervalId); // Stop the interval once the parent element is found
          // main()
          setupMutationObserver(parentElement); // Set up the MutationObserver
      }
  }, 500); // Check every 1/2 second
}

function setupMutationObserver(parentElement) {
  const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
              const addressesAdded = Array.from(mutation.addedNodes).some(node => node.tagName === 'LI');
              if (addressesAdded) {
                  observer.disconnect(); // Stop observing for mutations
                  main(); // Call your main function
              }
          }
      }
  });

  observer.observe(parentElement, { childList: true, subtree: true });
}


  // let zillow_search_box = document.getElementsByClassName("StyledFormControl-c11n-8-86-1__sc-18qgis1-0 DA-dAx Input-c11n-8-86-1__sc-4ry0fw-0 hxjfkY")[0];
function main () {

  // // Select the specific <ul>
  // const propertiesList = document.querySelector('.List-c11n-8-84-3__sc-1smrmqp-0'); // StyledSearchListWrapper-srp__sc-1ieen0c-0 doa-doM gKnRas photo-cards photo-cards_extra-attribution

  // console.log("BEEP BOOP PROGRAM ACTIVATED", propertiesList);


  // Select all <li> elements within this <ul>
  const listItems = document.getElementsByTagName('address');
  const priceListItems = this.document.getElementsByClassName("PropertyCardWrapper__StyledPriceLine-srp__sc-16e8gqd-1 iMKTKr");
  // //console.log("ADDRESS LIST", listItems[0]);
  let addresses_arr = [];
  setAddressesArray();

  function updateAddressesAndDisplayTagsInitial() {
    addresses_arr = setAddressesArray();
    createLoadingDisplayTags(addresses_arr, 0);
    // addresses_arr = await 
    // sendAllAddresses(addresses_arr, 0);
    // createEligibilityDisplayTags(addresses_arr, 0);
  }
  
  updateAddressesAndDisplayTagsInitial();
  
  async function sendAllAddresses(addresses, start_index) {
    for (let i = 0; i < addresses.length; i++) {
      let server_response = await sendAddress(addresses[i].url_address);
      addresses[i].USDA_response = server_response;//console.log(server_response)
  
      // Update the display for the current address
      createEligibilityDisplayTag(addresses[i], i + start_index);
    }
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

  function createLoadingDisplayTags(addresses_arr, start_index) {
    // //console.log("addresses @ display func", addresses_arr.length, priceListItems.length, start_index);
    for (let i = 0; i < addresses_arr.length; i++) {
      // //console.log(i, i + start_index)
      // Create a new span element to display the eligibility

      if (priceListItems[i + start_index].querySelector('span') === null) {
        ////console.log('The parent element has a child div element.');
        let span = document.createElement('span');
      
  
        // Set the text content of the span to the eligibility information
        // from the corresponding address in addresses_arr
        ////console.log("alleged content of response", addresses_arr[i].USDA_response.eligibilityResult);
        span.textContent = "Check Eligibility";
        ////console.log("alleged content of span", span.textContent);
        span.style.color = "white"
        span.style.fontSize = "12px"
        span.style.backgroundColor = "grey"
        span.style.marginLeft = "10px"
        span.style.padding = "2px 5px 2px 5px"
        span.style.borderRadius = "3px"

    
        // Append the span element to the current list item
        ////console.log("end of list items..", priceListItems[i + start_index])
        priceListItems[i + start_index].appendChild(span);

        span.addEventListener("click", (event) => {
          span.textContent = "Loading..."
          event.stopPropagation();
          sendAllAddresses([addresses_arr[i]], i + start_index);
        });
        
      }

    }
  }
  
  function createEligibilityDisplayTag(address_object, index) {
    // console.log("USDA RESULT", address_object.eligibilityResult)
    // for(let i = 0; i < listItems.length; i ++){

    // }
    let span = priceListItems[index].querySelector('span');
   //console.log(span)

    if (span) {
      span.textContent = address_object.USDA_response.eligibilityResult;
      span.style.backgroundColor = address_object.USDA_response.eligibilityResult === "Eligible" ? "green" : "red";
    }
  }




  function setAddressesArray(){
    let returned_addresses_array = [];
   //console.log("length of list", listItems.length)
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
 //console.log("addresses", listItems, addresses_arr)
  // Loop through the <li> elements using a for loop
  for(let i = 0; i < listItems.length; i++) {
     //console.log("woot", i, listItems[i].innerHTML); // Or any operation you want to perform
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
    ////console.log('Throttled scroll event triggered', listItems);
    // let old_array_length = addresses_arr.length;
    // addresses_arr = setAddressesArray();
    // let newly_loaded_arr = addresses_arr.slice(old_array_length)
    updateAddressesAndDisplayScroll()
    
}, 200); // Trigger at most once every 200ms (1/5th of a second)

async function updateAddressesAndDisplayScroll() {
  let old_array_length = addresses_arr.length;
  let new_array = setAddressesArray(); //array for slicing
  if(new_array.length > old_array_length){
    // let sliced_array = new_array.slice(old_array_length)
    ////console.log("THE ARRAYS", addresses_arr, new_array, sliced_array)
    // addresses_arr.concat(sliced_array);
    addresses_arr = new_array;
    createLoadingDisplayTags(addresses_arr, 0);
    // sliced_array = await 

    // sendAllAddresses(sliced_array, old_array_length);

    ////console.log("SLICE RESPONSE", sliced_array, addresses_arr.concat(sliced_array));
    // createEligibilityDisplayTags(sliced_array, old_array_length);
  }
}

// window.addEventListener('scroll', throttledScroll);

  const scrollArea = document.querySelector('#search-page-list-container')
 //console.log("where it scrolls", scrollArea)

  scrollArea.addEventListener('scroll', throttledScroll);
  // function() {
  //   // Your function code here
  //  //console.log('Properties being scrolled');
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

}