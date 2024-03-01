window.addEventListener('load', function () {
  main();
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "urlChanged") {
      console.log("URL changed");
      main()
  }
});

function main () {
  // console.log("MAINFIRED")
  let listItems = null;
  let is_initial_call = true;
  let addresses_arr = [];

  let list_items_selector = ".ListItem-c11n-8-84-3__sc-10e22w8-0 address"
  let favedAddressesSelector = '.list-card-addr'
  let favedPricesSelector = 'list-card-price';
  let searchPricesSelector = "#grid-search-results ul:nth-of-type(1) li div div article div div div:nth-of-type(2)  div span"
  //


  let priceListItems = null;

  let favedListPriceItems = document.querySelectorAll(favedPricesSelector);

  function awaitDOM(price_selector, selector, listItems) {
  
    const intervalId = setInterval(function() {
      // const secondDivs = document.querySelectorAll('#grid-earch-results ul:nth-of-type(1) li div div article div div div:nth-of-type(2) div span');


      if (listItems && listItems.length > 0) {
        // console.log("awaited dom", listItems, price_selector)
        if(is_initial_call === true){
          is_initial_call = false;
          updateAddressesAndDisplayTagsInitial(price_selector, selector, listItems);
        }
        else{
          updateAddressesAndDisplayScroll(price_selector, selector, listItems)
        }

        clearInterval(intervalId); // Clear the interval once the elements are found
      }
      else{
  
        listItems = document.querySelectorAll(selector);
      }
    }, 250); // Fires 4 times per second
    
    // Set a timeout to clear the interval after 8 seconds
    setTimeout(() => {
      clearInterval(intervalId);
    }, 12000);
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

const favPage = document.getElementsByClassName('FavoritesList__PageContainer-my-zillow__sc-7gr4g6-0 kGfAqS')[0];
const propertiesGrid = document.getElementById('grid-search-results');

// Create and start observers for each element
if (favPage) {
    createObserver(favPage, 'individualInfoPage');
}

if (propertiesGrid) {
    createObserver(propertiesGrid, 'propertiesGrid');
}

function createDetailsButton() {
  const intervalId = setInterval(function() {
    let price_span = document.getElementsByClassName("Text-c11n-8-99-3__sc-aiai24-0 Price__StyledHeading-fs-hdp__sc-1me8eh6-0 iDpxGV fbhNY")[0];

    if (price_span) {
      let deets_obj = createObjWithAddressValues(document.querySelectorAll('.hiPLdz h1')[0].textContent)


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
            createDetailsEligibility(stored_obj.USDA_response.eligibilityResult)
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
    event.stopPropagation();
    span.textContent = "Loading...";
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
  priceListItems = document.querySelectorAll(price_selector)
  console.log("at list loading", price_selector, priceListItems)

  for (let i = 0; i < addresses_arr.length; i++) {
      console.log("loaing loop", priceListItems[i], priceListItems[i].querySelector("elly"), priceListItems[i].getElementsByTagName("elly"))

      if (priceListItems[i].querySelector("elly") === null) {

        let relevant_element = priceListItems[i]

        let span = document.createElement('elly');
        // span.setAttribute("class", "eligibility-button")
        span = basicSpanStyling(span)
        relevant_element.appendChild(span);

        let stored_address = JSON.parse(localStorage.getItem(`${addresses_arr[i].address}`));

        if(stored_address){
          let stored_date = new Date(stored_address.time_updated)
          let under_week_old = isLessThanAWeekOld(stored_date)
          if(under_week_old){
            createEligibilityDisplayTag(price_selector, stored_address.address, stored_address.USDA_response.eligibilityResult, listItems)
          }
          else{
            stored_address.time_updated = new Date();
            localStorage.setItem(`${stored_address.address}`, JSON.stringify(stored_address))
            makeListButton(price_selector, addresses_arr, span, i, listItems)
          }
        }
        else{
          makeListButton(price_selector, addresses_arr, span, i, listItems)
        }
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

  if (differenceInDays < 7) {
    // console.log("The date is less than a week old.");
    // You can fire your function here
    return true;
  } else {
    // console.log("The date is past the last week.");
    return false;
  }
}

// Example usage


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
 
  return obj;
}

async function createDetailsObject (deets_obj){
  try{
    deets_obj = await addAndStoreResponse(deets_obj);
    console.log("deets res obj", deets_obj);
    if(deets_obj.USDA_response.eligibilityResult){
      localStorage.setItem(`${deets_obj.address}`, JSON.stringify(deets_obj));
      createDetailsEligibility(deets_obj.USDA_response.eligibilityResult);

    }
    else if(deets_obj.USDA_response.errorMessage){
      createDetailsEligibility("error");
    }
  }
  catch{
    createDetailsEligibility("error");
  }

}
  

async function addAndStoreResponse (deets_obj) {

  deets_obj.USDA_response = await sendAddress(deets_obj.url_address);
  // 

  return deets_obj;
}

function createDetailsEligibility (result){
  let span = document.querySelector(".deets_button")
  span = eligibilityStyle(span);

  if (span) {
    span.textContent = result;
    span.style.backgroundColor = result === "Eligible" ? "green" : "red";
    if(result === "error"){
      alert("error - try copying and pasting manually to the USDA eligibility site: https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=assessmentType")
      price_span.appendChild(error_stuff)
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
    if((window.location.href.includes("https://www.zillow.com") && window.location.href.includes("?searchQueryState=")) || window.location.href.includes("https://www.zillow.com/homes/")){

        // runList(searchPricesSelector, list_items_selector, listItems)
        awaitDOM(searchPricesSelector, list_items_selector, listItems);
    }
    else if(window.location.href.includes("https://www.zillow.com/homedetails")){
      createDetailsButton();
    }
    else if(window.location.href.includes("https://www.zillow.com/myzillow/favorites")){
      // updateAddressesAndDisplayTagsInitial(list_items_selector);
      // runList(favedPricesSelector, favedAddressesSelector, listItems)
      awaitDOM(favedPricesSelector, favedAddressesSelector, listItems)
    }

  }
  startAll()

  async function runList (pricesSelector, list_items_selector, listItems) {
    await asyncAwaitDOM()
  }

  function updateAddressesAndDisplayTagsInitial(price_selector, list_items_selector, listItems) {
    addresses_arr = setAddressesArray(list_items_selector);
    createLoadingDisplayTags(price_selector, addresses_arr, listItems);

  }
  

  
  async function sendAllAddresses(price_selector, addresses, listItems) {
    console.log("at send all", listItems)
    for (let i = 0; i < addresses.length; i++) {
      try{

        let server_response = await sendAddress(addresses[i].url_address);
        if(server_response.eligibilityResult){
          addresses[i].USDA_response = server_response;
          localStorage.setItem(`${addresses[i].address}`, JSON.stringify(addresses[i]));
  
          // Update the display for the current address
          createEligibilityDisplayTag(price_selector, addresses[i].address, addresses[i].USDA_response.eligibilityResult, listItems);
        }
        else if(server_response.errorMessage){
          createEligibilityDisplayTag(price_selector, addresses[i].address, "error", listItems);
        }

      }
      catch{
        createEligibilityDisplayTag(price_selector, addresses[i].address, "error", listItems);
      }

    }
  }
  
  function sendAddress(url_address) {
    return new Promise((resolve, reject) => {
        let timeoutId = setTimeout(() => {
            reject(new Error("Server timeout"));
        }, 9000); // 9-second timeout

        chrome.runtime.sendMessage({
            action: "checkEligibility",
            address: url_address
        }, response => {
            clearTimeout(timeoutId); // Clear the timeout if a response is received
            if (response) {
                let eligibility_response = JSON.parse(response.data);
                resolve(eligibility_response);
            } else {
                reject(new Error("No response from server"));
            }
        });
    });
  }


  
  function createEligibilityDisplayTag(price_selector, address, response, listItems) {
    console.log("at display tags", listItems) 
    for(let i = 0; i < addresses_arr.length; i ++){
      let USDA_address = address;
      let zillow_address = listItems[i].textContent;
      console.log("TO COMPARE", USDA_address, zillow_address)
      if(zillow_address === USDA_address){
        priceListItems = document.querySelectorAll(price_selector);
        let span = priceListItems[i].querySelector('elly');
        span = eligibilityStyle(span);

        //console.log(span)
     
         if (span) {
           span.textContent = response;
           span.style.backgroundColor = response === "Eligible" ? "green" : "red";

           if(response === "error"){
            alert("error - try copying and pasting manually to the USDA eligibility site: https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do?pageAction=assessmentType")
            // priceListItems[i].appendChild(error_stuff)
          }
         }
         break;
      }
    }

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
  console.log("update on scroll fired", price_selector, listItems)
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