window.addEventListener('load', function () {
// getEventElement(); 
  // observing();  
  main();
})

//   // let zillow_search_box = document.getElementsByClassName("StyledFormControl-c11n-8-86-1__sc-18qgis1-0 DA-dAx Input-c11n-8-86-1__sc-4ry0fw-0 hxjfkY")[0];
function main () {

  document.addEventListener("click", (event) => {
    checkURL();
  })

  function checkURL() {
    const intervalId = setInterval(function() {
      if (window.location.href.includes("https://www.zillow.com/homedetails/")) {
        console.log("URL found");
        createDetailsButton();
        awaitDetailsContent();
        clearInterval(intervalId); // Clear the interval once the elements are found
      }
    }, 333); // Fires 3 times per second
    
    // Set a timeout to clear the interval after 8 seconds
    setTimeout(() => {
      clearInterval(intervalId);
    }, 8000);
  }

  function awaitDetailsContent() {
    console.log("new url detected")
    const intervalId = setInterval(function() {
      if (document.getElementsByClassName('fjZZmz').length > 0) {
        console.log("DETAILS LOADED");
        clearInterval(intervalId); // Clear the interval once the elements are found
      }
    }, 333); // Fires 3 times per second
    
    // Set a timeout to clear the interval after 8 seconds
    setTimeout(() => {
      clearInterval(intervalId);
    }, 8000); // 8000 milliseconds = 8 seconds// Fires 3 times per second
  }

  function createObserver(element, elementName) {
    console.log("sources of mut", document.getElementsByClassName('home-detail-lightbox-container')[0], document.getElementById('grid-search-results'))
    // Create a callback function that has access to elementName
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            console.log(`Mutation observed in ${elementName}:`, mutation.target.id);
            if(elementName === "propertiesGrid"){
              startAll();
            }
            else if(elementName === "individualInfoPage"){
              console.log("INFO MUTATED MOFO")
              // createDetailsButton();
            }
        }
        
    };

    // Create an instance of MutationObserver with the callback function
    const observer = new MutationObserver(callback);

    // Define what to observe
    const config = { attributes: true, childList: true, subtree: true };

    // Start observing the element
    observer.observe(element, config);
}

const individualInfoPage = document.getElementsByClassName('search-detail-lightbox')[0];
const propertiesGrid = document.getElementById('grid-search-results');

// Create and start observers for each element
if (individualInfoPage) {
    createObserver(individualInfoPage, 'individualInfoPage');
}

if (propertiesGrid) {
    createObserver(propertiesGrid, 'propertiesGrid');
}

function createDetailsButton() {
  const intervalId = setInterval(function() {
    let price_span = document.getElementsByClassName("Text-c11n-8-99-3__sc-aiai24-0 Price__StyledHeading-fs-hdp__sc-1me8eh6-0 iDpxGV fbhNY")[0];

    if (price_span) {
      let deets_obj = createObjWithAddressValues(document.querySelectorAll('.hiPLdz h1')[0].innerText)


      if(price_span.getElementsByClassName("deets_button").length === 0){
        let span = document.createElement('span');

        price_span.appendChild(span);
        span = basicSpanStyling(span)
        span.setAttribute('class', "deets_button");

        let stored_obj = JSON.parse(localStorage.getItem(`${deets_obj.address}`));

        if(stored_obj){
          let stored_date = new Date(stored_obj.time_updated)
          let under_week_old = isLessThanAWeekOld(stored_date)
          if(under_week_old){
            createDetailsEligibility(stored_obj)
          }
          else{
            stored_obj.time_updated = new Date();
            localStorage.setItem(`${stored_obj.address}`, JSON.stringify(stored_obj))
            makeDetailsPageButton(span, deets_obj)
          }
        }
        else{
          makeDetailsPageButton(span, deets_obj)
        }

      }

      clearInterval(intervalId); // Stop checking once the button is created
    }
  }, 333); // Fires 3 times per second

  // Set a timeout to clear the interval after 8 seconds
  setTimeout(() => {
    clearInterval(intervalId);
  }, 8000);
}

function makeDetailsPageButton (span, deets_obj) {

  span = setButtonStyle(span)
  span.textContent = "Check Eligibility";

  span.addEventListener("click", (event) => {
    span.textContent = "Loading...";
    event.stopPropagation();
    createDetailsObject(deets_obj);
  });
  console.log("Button added");
}

function basicSpanStyling (span) {
  span.style.fontSize = "12px"
  span.style.padding = "2px 5px 2px 5px"
  span.style.marginLeft = "10px"
  span.style.color = "white"
  span.style.borderRadius = "4px"
  return span;
}

function createLoadingDisplayTags(addresses_arr) {
  // //console.log("addresses @ display func", addresses_arr.length, priceListItems.length, start_index);
  for (let i = 0; i < addresses_arr.length; i++) {
    // //console.log(i, i + start_index)
    // Create a new span element to display the eligibility
    // console.log("cuurent addddd", JSON.parse(localStorage.getItem(`${addresses_arr[i].address}`)))

      if (priceListItems[i].querySelector('span') === null) {
        ////console.log('The parent element has a child div element.');
        let relevant_element = priceListItems[i]

        let span = document.createElement('span');
        span = basicSpanStyling(span)
        relevant_element.appendChild(span);
        

        let stored_address = JSON.parse(localStorage.getItem(`${addresses_arr[i].address}`));

        if(stored_address){
          let stored_date = new Date(stored_address.time_updated)
          let under_week_old = isLessThanAWeekOld(stored_date)
          if(under_week_old){
            createEligibilityDisplayTag(stored_address)
          }
          else{
            stored_address.time_updated = new Date();
            localStorage.setItem(`${stored_address.address}`, JSON.stringify(stored_address))
            makeListButton(span, i)
          }
        }
        else{
          makeListButton(span, i)
        }
      }


  }
}

function makeListButton (span, i) {

  span = setButtonStyle(span)
  span.textContent = "Check Eligibility";

  span.addEventListener("click", (event) => {
    span.textContent = "Loading..."
    event.stopPropagation();
    sendAllAddresses([addresses_arr[i]], i);
  });
}

function addCheckButton (relevant_element) {
  let span = document.createElement('span');
      
  span = setButtonStyle(span)
  span.textContent = "Check Eligibility";
  relevant_element.appendChild(span);
  
  return span;
}

function isLessThanAWeekOld(stored_date) {
  // const givenDate = new Date(dateString);
  const currentDate = new Date();
  const differenceInDays = (currentDate - stored_date) / (1000 * 60 * 60 * 24);
  console.log("week old", stored_date, currentDate, differenceInDays)

  if (differenceInDays < 7) {
    console.log("The date is less than a week old.");
    // You can fire your function here
    return true;
  } else {
    console.log("The date is past the last week.");
    return false;
  }
}

// Example usage
;

function createObjWithAddressValues(address_element_text){
  let obj = {
    address: "",
    url_address: "", 
    USDA_response: null,
    time_updated: "",
  }

  obj.address = address_element_text;
  // Replace non-breaking spaces with regular spaces
  obj.address = obj.address.replace(/\u00A0/g, " ");
  // Encode spaces for URL
  obj.url_address = obj.address.replace(/ /g, "%20");

  let date = new Date();

  obj.time_updated = date.toISOString();
 
  console.log("the obj", obj)
  return obj;
}

async function createDetailsObject (deets_obj){
  console.log("element for deets obj", document.querySelectorAll('.hiPLdz h1'))
  deets_obj = await addAndStoreResponse(deets_obj);
  createDetailsEligibility(deets_obj);
}
  

async function addAndStoreResponse (deets_obj) {
  // console.log("url address", deets_obj.url_address);
  deets_obj.USDA_response = await sendAddress(deets_obj.url_address);
  localStorage.setItem(`${deets_obj.address}`, JSON.stringify(deets_obj));

  return deets_obj;
}

function createDetailsEligibility (obj){
  console.log("deets elly obj", obj)
  let span = document.querySelector(".deets_button")
  span = eligibilityStyle(span);
  // console.log("deets eligibility func", span, obj)

  if (span) {
    span.textContent = obj.USDA_response.eligibilityResult;
    span.style.backgroundColor = obj.USDA_response.eligibilityResult === "Eligible" ? "green" : "red";
  }
}

  function setButtonStyle (span) {
    span.style.backgroundColor = "grey"
    span.style.cursor = "pointer"
    span.style.border = "2px solid black"
    return span;
  }

  function eligibilityStyle (span) {
    span.style.border = "0px solid white"
    return span;
  }


  let is_initial_call = true;

  function startAll () {
    if(is_initial_call === true){
      is_initial_call = false
      // updateAddressesAndDisplayTagsInitial();
    }
    else{
      updateAddressesAndDisplayScroll();
    }
  }
  // Select all <li> elements within this <ul>
  // const list = document.getElementsByClassName(".PropertyCardWrapper__StyledPriceLine-srp__sc-16e8gqd-1.iMKTKr")
  let listItems = document.querySelectorAll('.ListItem-c11n-8-84-3__sc-10e22w8-0 address');
  console.log("lisItems", listItems)
  const priceListItems = document.getElementsByClassName("PropertyCardWrapper__StyledPriceLine-srp__sc-16e8gqd-1 iMKTKr");
  // //console.log("ADDRESS LIST", listItems[0]);
  let addresses_arr = [];
  setAddressesArray();

  function updateAddressesAndDisplayTagsInitial() {
    addresses_arr = setAddressesArray();
    createLoadingDisplayTags(addresses_arr);
    // addresses_arr = await 
    // sendAllAddresses(addresses_arr, 0);
    // createEligibilityDisplayTags(addresses_arr, 0);
  }
  
  updateAddressesAndDisplayTagsInitial();
  
  async function sendAllAddresses(addresses, start_index) {
    for (let i = 0; i < addresses.length; i++) {
      let server_response = await sendAddress(addresses[i].url_address);
      addresses[i].USDA_response = server_response;//console.log(server_response)
      localStorage.setItem(`${addresses[i].address}`, JSON.stringify(addresses[i]));
  
      // Update the display for the current address
      createEligibilityDisplayTag(addresses[i]);
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


  
  function createEligibilityDisplayTag(address_object) {
    console.log("list elly obj", address_object)

    // console.log("USDA RESULT", address_object.USDA_response, listItems[index])
    for(let i = 0; i < addresses_arr.length; i ++){
      let USDA_address = address_object.address;
      let zillow_address = listItems[i].textContent;
      console.log("TO COMPARE", USDA_address, zillow_address)
      if(zillow_address === USDA_address){
        let span = priceListItems[i].querySelector('span');
        span = eligibilityStyle(span);

        //console.log(span)
     
         if (span) {
           span.textContent = address_object.USDA_response.eligibilityResult;
           span.style.backgroundColor = address_object.USDA_response.eligibilityResult === "Eligible" ? "green" : "red";
         }
         break;
      }
    }

  }




  function setAddressesArray(){
  listItems = document.querySelectorAll('.ListItem-c11n-8-84-3__sc-10e22w8-0 address');
    let returned_addresses_array = [];
   //console.log("length of list", listItems.length)
    for(let i = 0; i < listItems.length; i++){
      let address_obj = createObjWithAddressValues(listItems[i].innerHTML)
      // let addresses_obj = {
      //   address: "",
      //   url_address: "", 
      //   USDA_response: null,
      // }
      // addresses_obj.address = listItems[i].innerHTML;
      // addresses_obj.url_address = addresses_obj.address.replace(/ /g, "%20");
      returned_addresses_array.push(address_obj);
    }
    return returned_addresses_array;
  }
 //console.log("addresses", listItems, addresses_arr)
  // Loop through the <li> elements using a for loop
  // for(let i = 0; i < listItems.length; i++) {
  //    //console.log("woot", i, listItems[i].innerHTML); // Or any operation you want to perform
  // }


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


    // updateAddressesAndDisplayScroll()
    
}, 200); // Trigger at most once every 200ms (1/5th of a second)

function updateAddressesAndDisplayScroll() {
  let old_array_length = addresses_arr.length;
  let new_array = setAddressesArray(); //array for slicing
  if(new_array.length > old_array_length){
    // let sliced_array = new_array.slice(old_array_length)
    ////console.log("THE ARRAYS", addresses_arr, new_array, sliced_array)
    // addresses_arr.concat(sliced_array);
    addresses_arr = new_array;
    createLoadingDisplayTags(addresses_arr);
    // sliced_array = await 

    // sendAllAddresses(sliced_array, old_array_length);

    ////console.log("SLICE RESPONSE", sliced_array, addresses_arr.concat(sliced_array));
    // createEligibilityDisplayTags(sliced_array, old_array_length);
  }
}

// window.addEventListener('scroll', throttledScroll);

  const scrollArea = document.querySelector('#search-page-list-container')
 //console.log("where it scrolls", scrollArea)

 if(scrollArea){
  scrollArea.addEventListener('scroll', throttledScroll);
 }

  // function() {
  //   // Your function code here
  //  //console.log('Properties being scrolled');
  // });






      

  // }

}