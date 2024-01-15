window.addEventListener('load', function () {
  let zillow_search_box = document.getElementsByClassName("StyledFormControl-c11n-8-86-1__sc-18qgis1-0 DA-dAx Input-c11n-8-86-1__sc-4ry0fw-0 hxjfkY")[0];

  console.log("BEEP BOOP PROGRAM ACTIVATED", zillow_search_box);

  let a_str = "";

  zillow_search_box.onkeyup = function(e) {
    // console.log("typiiiiing")
    a_str = zillow_search_box.value;
    console.log(a_str);
    
    if(zillow_search_box === document.activeElement && e.key === "Enter"){
      alert(`entering the search ${a_str}`)
    }
  }

  let zillow_search_button = document.getElementsByClassName("StyledAdornment-c11n-8-86-1__sc-1kerx9v-0 AdornmentRight-c11n-8-86-1__sc-1kerx9v-2 ddthKA ecdnJo SearchBox__StyledSearchBoxAdornment-rxevgz-0 gXdUka")[0];

  zillow_search_button.onclick = function() {
    alert(`clicking the search ${a_str}`)
    
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