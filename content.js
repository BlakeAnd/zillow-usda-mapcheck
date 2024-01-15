window.addEventListener('load', function () {
  let zillow_search_box = document.getElementsByClassName("StyledFormControl-c11n-8-86-1__sc-18qgis1-0 DA-dAx Input-c11n-8-86-1__sc-4ry0fw-0 hxjfkY")[0];

  console.log("BEEP BOOP PROGRAM ACTIVATED", zillow_search_box);

  document.onkeyUp = function() {
    let a_str = zillow_search_box.value;
  }

  // next get element and assign variable for clicking search button
  // and handle clicking enter with search box focussed




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