window.addEventListener('load', function () {
  main();
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "urlChanged") {
      // console.log("URL changed");
      main()
  }
});

function main () {
  // console.log("MAINFIRED")
  let listItems = null;
  let is_initial_call = true;
  let addresses_arr = [];

  let list_items_selector = "#grid-search-results address"
  // ".ListItem-c11n-8-84-3__sc-10e22w8-0 address"
  let favedAddressesSelector = '.list-card-addr'

  let searchPricesSelector = "[data-test='property-card-price']"
  let favedPricesSelector = '.list-card-price';

  //
  let priceListItems = null;

  // let favedListPriceItems = document.querySelectorAll(favedPricesSelector);

  // makeAboutButton()
  // function makeAboutButton(){
  //   let about_button = document.querySelector("usda_button");
  //   if(!about_button){
  //     about_button = document.createElement("usda_button");
  //     let nav = document.querySelector("[data-zg-section='user']")
  //     console.log("nav", nav)
  //     about_button.textContent = "USDA Eligibility Checker"
  //     nav.parentElement.appendChild(about_button)
  //     about_button.marginLeft = "15px"
  //   }
  // }

  function awaitDOM(selector) {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        const listItems = document.querySelectorAll(selector);
        if (listItems && listItems.length > 0) {
          clearInterval(intervalId);
          resolve(listItems); // Resolve the promise with the listItems
        }
      }, 250); // Fires 4 times per second
  
      // Set a timeout to clear the interval and reject the promise after 12 seconds
      setTimeout(() => {
        clearInterval(intervalId);
        reject(new Error('Timeout waiting for DOM elements'));
      }, 12000);
    });
  }

  function createObserver(element, elementName) {
    // console.log("sources of mut", document.getElementsByClassName('home-detail-lightbox-container')[0], document.getElementById('grid-search-results'))
    // Create a callback function that has access to elementName
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
          startAll();  
        }
        
    };

    // Create an instance of MutationObserver with the callback function
    const observer = new MutationObserver(callback);

    // Define what to observe
    const config = { attributes: true, childList: true, subtree: true };

    // Start observing the element
    observer.observe(element, config);
}

// const favPage = document.getElementsByClassName('FavoritesList__PageContainer-my-zillow__sc-7gr4g6-0 kGfAqS')[0];

const firstFavGridElement = document.querySelector('[data-test="PropertyListCard-wrapper"]');
console.log("fav element", firstFavGridElement)


const propertiesGrid = document.getElementById('grid-search-results');

// Create and start observers for each element
if (firstFavGridElement) {
  const favGrid = firstFavGridElement.parentElement.parentElement.parentElement;
  createObserver(favGrid, 'individualInfoPage');
}

if (propertiesGrid) {
  createObserver(propertiesGrid, 'propertiesGrid');
}

function createDetailsButton(price_selector_deets, selector_deets) {
  const intervalId = setInterval(function() {
    // let price_span_old = document.querySelector(".layout-static-column-container div div div:nth-of-type(2) div div div div div div div span span")
    let price_span = document.querySelector(price_selector_deets);
    // console.log("deets button time", price_span, price_span_old)

    if (price_span) {
      let address = document.querySelector(selector_deets).textContent
      let deets_obj = createObjWithAddressValues(address)
      console.log("at deets buttn", price_span, address)


      if(price_span.getElementsByClassName("deets_button").length === 0){

        let span = document.createElement('span');

        price_span.appendChild(span);
        span = basicSpanStyling(span)
        span.setAttribute('class', "deets_button");
        span.setAttribute('id', deets_obj.id_address);

        let stored_obj = JSON.parse(localStorage.getItem(`${deets_obj.address}`));
        if(stored_obj && stored_obj.USDA_response.eligibilityResult && stored_obj.id_address){
          let stored_date = new Date(stored_obj.time_updated)
          let under_week_old = isLessThanAWeekOld(stored_date)
          if(under_week_old){
            createDetailsEligibility(stored_obj.USDA_response.eligibilityResult, stored_obj.id_address)
          }
          else{
            // stored_obj.time_updated = new Date();
            // localStorage.setItem(`${stored_obj.address}`, JSON.stringify(stored_obj))
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
    event.stopPropagation();
    // set interval to count every second up to ste 
    span.textContent = "Loading..."; //should say loading 1/9 etc
    createDetailsObject(deets_obj);

  });
  // console.log("Button added");
}

function basicSpanStyling (span) {
  span.style.fontSize = "12px"
  span.style.padding = "2px 5px 2px 5px"
  span.style.marginLeft = "10px"
  span.style.color = "white"
  span.style.borderRadius = "4px"
  return span;
}

function createLoadingDisplayTags(price_selector, addresses_arr, listItems) {
  console.log("at loading display from initial")
  priceListItems = document.querySelectorAll(price_selector)
  // console.log("at list loading", price_selector, priceListItems)

  for (let i = 0; i < addresses_arr.length; i++) {
      // console.log("loaing loop", priceListItems[i], priceListItems[i].querySelector("elly"), priceListItems[i].getElementsByTagName("elly"))



      //make basic span...
      //look for stored data
      //if new stored data, set eligibility
      //if old data, update and
      let relevant_element = priceListItems[i]
      let span = null;
      
      let stored_address = JSON.parse(localStorage.getItem(`${addresses_arr[i].address}`));

      if (priceListItems[i].querySelector("elly") === null) {
        span = document.createElement('elly');
        span.setAttribute("id", addresses_arr[i].id_address)
        span = basicSpanStyling(span)
        relevant_element.appendChild(span);

        if(stored_address){
          let stored_date = new Date(stored_address.time_updated)
          let under_week_old = isLessThanAWeekOld(stored_date)
          if(under_week_old){
            createEligibilityDisplayTag(price_selector, stored_address.id_address, stored_address.USDA_response.eligibilityResult, listItems)
          }
          else{
            // stored_address.time_updated = new Date();
            // localStorage.setItem(`${stored_address.address}`, JSON.stringify(stored_address))
            makeListButton(price_selector, addresses_arr, span, i, listItems)
          }
        }
        else{
          makeListButton(price_selector, addresses_arr, span, i, listItems)
        }
      }
      else{
        span = relevant_element.querySelector("elly")
        if(stored_address){
          let stored_date = new Date(stored_address.time_updated)
          let under_week_old = isLessThanAWeekOld(stored_date)
          if(under_week_old && span.textContent !== stored_address.USDA_response.eligbility){
            createEligibilityDisplayTag(price_selector, stored_address.id_address, stored_address.USDA_response.eligibilityResult, listItems)
          }
          else if(span.textContent == stored_address.USDA_response.eligbility){
            // stored_address.time_updated = new Date();
            // localStorage.setItem(`${stored_address.address}`, JSON.stringify(stored_address))
            makeListButton(price_selector, addresses_arr, span, i, listItems)
          }
        }
        // else if(span.textContent !== "Check Eligibility"){
        //   makeListButton(price_selector, addresses_arr, span, i, listItems)
        // }
      }
  }
}

function makeListButton (price_selector, addresses_arr,  span, i, listItems) {

  span = setButtonStyle(span)
  span.textContent = "Check Eligibility";

  span.addEventListener("click", (event) => {
    event.stopPropagation();
    span.textContent = "Loading..."
    sendAllAddresses(price_selector, [addresses_arr[i]], listItems);

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
  // console.log("week old", stored_date, currentDate, differenceInDays) 
  if (differenceInDays < 180) {
    // console.log("The date is less than a week old.");
    // You can fire your function here
    return true;
  } 
  else {
    // console.log("The date is past the last week.");
    return false;
  }
}

// Example usage


function createObjWithAddressValues(address_element_text){
  let obj = {
    address: "",
    url_address: "",
    id_address: "", 
    USDA_response: null,
    time_updated: "",
  }

  obj.address = address_element_text;
  // Replace non-breaking spaces with regular spaces
  obj.address = obj.address.replace(/\u00A0/g, " ");
  // Encode spaces for URL
  obj.url_address = obj.address.replace(/ /g, "%20");
 

  obj.id_address = obj.address.replace(/[^a-zA-Z0-9 ]/g, "");
  obj.id_address = obj.id_address.replace(/ /g, "_");
  // console.log("potential id", obj.id_address);

  let date = new Date();

  obj.time_updated = date.toISOString();
 
  return obj;
}

async function createDetailsObject (deets_obj){
  console.log("deets obj", deets_obj)
  try{
    deets_obj = await addAndStoreResponse(deets_obj);
    // console.log("deets res obj", deets_obj);
    if(deets_obj.USDA_response.eligibilityResult){
      localStorage.setItem(`${deets_obj.address}`, JSON.stringify(deets_obj));
      createDetailsEligibility(deets_obj.USDA_response.eligibilityResult, deets_obj.id_address);

    }
    else if(deets_obj.USDA_response.errorMessage){
      createDetailsEligibility("error", deets_obj.id_address);
    }
  }
  catch{
    createDetailsEligibility("error", deets_obj.id_address);
  }

}
  

async function addAndStoreResponse (deets_obj) {

  deets_obj.USDA_response = await sendAddress(deets_obj.url_address, deets_obj.id_address);
  // 

  return deets_obj;
}

function createDetailsEligibility (result, id){
  let span = document.querySelector(".deets_button")
  // let span = document.getElementById(id)
  span = eligibilityStyle(span);

  if (span) {
    span.textContent = result;
    span.style.backgroundColor = result === "Eligible" ? "green" : "red";
    if(result === "error"){
      alert("error - try copying and pasting manually to the USDA eligibility site: https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=assessmentType")
      span.textContent = "error";
    }
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



  function startAll () {
    if(window.location.href.includes("https://www.zillow.com/homedetails")){
      createDetailsButton(`[data-testid="price"] span`, "[data-testid='fs-chip-container'] div div div h1");
    }
    else if(window.location.href.includes("https://www.zillow.com/myzillow/favorites")){
      // updateAddressesAndDisplayTagsInitial(list_items_selector);
      runList(favedPricesSelector, favedAddressesSelector, listItems)
      // awaitDOM(favedPricesSelector, favedAddressesSelector, listItems)
    }
    else if((window.location.href.includes("https://www.zillow.com/homes/") && window.location.href.includes("_zpid"))){
      handleIndividualSearchPage(`[data-testid="price"] span`, "[data-testid='fs-chip-container'] div div div h1")
    }
    else if((window.location.href.includes("https://www.zillow.com") && window.location.href.includes("?searchQueryState=")) || window.location.href.includes("https://www.zillow.com/homes")){

      runList(searchPricesSelector, list_items_selector, listItems)
    // awaitDOM(searchPricesSelector, list_items_selector, listItems);
}

  }
  startAll()

  function handleIndividualSearchPage(price_selector, addy_selector){
    console.log("indy search", document.querySelector(price_selector), document.querySelector(addy_selector))
    if(document.querySelector(price_selector) && document.querySelector(addy_selector)){
      createDetailsButton(price_selector, addy_selector)
    }
  }

  async function runList(price_selector, list_items_selector) {
    try {
      const listItems = await awaitDOM(list_items_selector);
      if (is_initial_call === true) {
        is_initial_call = false;
        let addresses_arr = updateAddressesAndDisplayTagsInitial(price_selector, list_items_selector, listItems);
        createLoadingDisplayTags(price_selector, addresses_arr, listItems);
      } else {
        updateAddressesAndDisplayScroll(price_selector, list_items_selector, listItems);
      }
    } catch (error) {
      // console.error('Error waiting for DOM elements:', error);
      // Handle the error as needed
    }
  }
  

  async function runListold (pricesSelector, list_items_selector, listItems) {
    listItems = await awaitDOM(pricesSelector, list_items_selector, listItems)
    if(is_initial_call === true){
      is_initial_call = false;
      updateAddressesAndDisplayTagsInitial(price_selector, selector, listItems);
    }
    else{
      updateAddressesAndDisplayScroll(price_selector, selector, listItems)
    }
  }

  function updateAddressesAndDisplayTagsInitial(price_selector, list_items_selector, listItems) {
    addresses_arr = setAddressesArray(list_items_selector);
    return addresses_arr;

  }
  

  
  async function sendAllAddresses(price_selector, addresses, listItems) {
    // console.log("at send all", listItems, addresses)
    for (let i = 0; i < addresses.length; i++) {
      try{
    // console.log("at send all", addresses[i].url_address)
        let server_response = await sendAddress(addresses[i].url_address, addresses[i].id_address);
        if(server_response.eligibilityResult){
          addresses[i].USDA_response = server_response;
          // console.log("res at send all", server_response)
          localStorage.setItem(`${addresses[i].address}`, JSON.stringify(addresses[i]));
  
          // Update the display for the current address
          createEligibilityDisplayTag(price_selector, addresses[i].id_address, addresses[i].USDA_response.eligibilityResult, listItems);
        }
        else if(server_response.errorMessage){
          createEligibilityDisplayTag(price_selector, addresses[i].id_address, "error", listItems);
        }

      }
      catch{
        createEligibilityDisplayTag(price_selector, addresses[i].id_address, "error", listItems);
      }

    }
  }

  function sendAddress(url_address, selector) {
    let element = document.getElementById(selector);
    console.log("sendadd", selector, element);
    let counter = 1;
    const maxCount = 9;
    let dotCount = 0;
    const intervalId = setInterval(() => {
      if (counter <= maxCount) {
        // element.textContent = `Loading ${counter}/${maxCount}`;
        dotCount = (dotCount + 1) % 4; // Cycle through 0, 1, 2, 3
        // let text = "Loading";
        // for (let i = 0; i < 4; i++) {
        //     text += i === dotCount ? "_" : ".";
        // }
        // element.textContent = text;
        element.textContent = "Loading" + ".".repeat(dotCount);
        counter++;
      } else {
        clearInterval(intervalId); // Stop the interval when the count reaches the maximum
      }
    }, 1000); // Count every second
  
    return new Promise((resolve, reject) => {
      let timeoutId = setTimeout(() => {
        clearInterval(intervalId); // Stop the interval when the timeout occurs
        element.textContent = "Server timeout"; // Update the element to show the timeout message
        reject(new Error("Server timeout"));
      }, 9000); // 9-second timeout
  


      chrome.runtime.sendMessage({
        action: "checkEligibility",
        address: url_address
      }, response => {
        clearTimeout(timeoutId); // Clear the timeout if a response is received
        clearInterval(intervalId); // Stop the interval when a response is received
        if (response) {
          let eligibility_response = JSON.parse(response.data);
          resolve(eligibility_response);
        } else {
          reject(new Error("No response from server"));
        }
      });
    });
  }
  
  
  function sendddAddress(url_address, selector) {
    let element = document.getElementById(selector);
    //add a setinterval that sets the content of element to be x/9 where x goes up every second
    return new Promise((resolve, reject) => {
        let timeoutId = setTimeout(() => {
            let span = document.selector;
            reject(new Error("Server timeout"));
            document.selector
        }, 9000); // 9-second timeout

        chrome.runtime.sendMessage({
            action: "checkEligibility",
            address: url_address
        }, response => {
            clearTimeout(timeoutId); // Clear the timeout if a response is received
            if (response) {
              // console.log("response at send add", response)
                let eligibility_response = JSON.parse(response.data);
              // console.log("response at send add", eligibility_response)

                resolve(eligibility_response);
            } else {
                reject(new Error("No response from server"));
            }
        });
    });
  }

  
  function createEligibilityDisplayTag(price_selector, id_address, response, listItems) {
    //differnt lengths, addresses_are bigger, fix this
    // console.log("at display tags", address, response, listItems[0].textContent, addresses_arr.length, listItems.length) 
 
    console.log(id_address, document.getElementById(id_address))
    let span = document.getElementById(id_address);
    span = eligibilityStyle(span);

    //console.log(span)
 
     if (span) {
       span.textContent = response;
       span.style.backgroundColor = response === "Eligible" ? "green" : "red";

       if(response === "error"){
        alert("error - try copying and pasting manually to the USDA eligibility site: https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=assessmentType")
        // span.parentElement.appendChild(error_stuff)
      }
    }

    // for(let i = 0; i < addresses_arr.length; i ++){
    //   let USDA_address = address;
    //   let zillow_address = listItems[i].textContent;
    //   // console.log("TO COMPARE", USDA_address, zillow_address)
    //   if(zillow_address === USDA_address){
    //     priceListItems = document.querySelectorAll(price_selector);
    //     // console.log("display price list", priceListItems)
    //     let span = priceListItems[i].querySelector('elly');
    //     span = eligibilityStyle(span);

    //     //console.log(span)
     
    //      if (span) {
    //        span.textContent = response;
    //        span.style.backgroundColor = response === "Eligible" ? "green" : "red";

    //        if(response === "error"){
    //         alert("error - try copying and pasting manually to the USDA eligibility site: https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=assessmentType")
    //         // priceListItems[i].appendChild(error_stuff)
    //       }
    //      }
    //      break;
    //   }
    // }

  }


  // awaitDOM();

  function setAddressesArray(selector){
  listItems = document.querySelectorAll(selector);
    let returned_addresses_array = [];
   //console.log("length of list", listItems.length)
    for(let i = 0; i < listItems.length; i++){
      let address_obj = createObjWithAddressValues(listItems[i].textContent)

      returned_addresses_array.push(address_obj);
    }
    return returned_addresses_array;
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
    startAll()
    
}, 200); // Trigger at most once every 200ms (1/5th of a second)

function updateAddressesAndDisplayScroll(price_selector, selector, listItems) {
  // console.log("update on scroll fired", price_selector, listItems)
  // let old_array_length = addresses_arr.length;
  let new_array = setAddressesArray(selector); //array for slicing
  // if(new_array.length > old_array_length){

  //   // sliced_array = await 
  // }
  addresses_arr = new_array;
  createLoadingDisplayTags(price_selector, addresses_arr, listItems);
}

// window.addEventListener('scroll', throttledScroll);

  const scrollArea = document.querySelector('#search-page-list-container')
 //console.log("where it scrolls", scrollArea)

 if(scrollArea){
  scrollArea.addEventListener('scroll', throttledScroll);
 }

}