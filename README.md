If manifest.json needs changed, manifest v3 examples were found here: 
https://developer.chrome.com/docs/extensions/reference/manifest#inject-a-content-script


Next Steps:
**Important** 
1) set up function to fire on scroll, compare arrays etc. 
LOGIC
initially [implemented]
* set_addresses
* send_addresses(all)

scrolling
* set_new_address_array
* compare_to_old
* slice_end_off
* set_addresses
* send_addresess(sliced)

2) change program start condition from refresh/load (page does not refresh when new search is made so pluign does not get fired rn), to click of search suggestion element or pressing of enter key (keep refresh as well just to safe, just add the other ones on)

3) set up localstorage for addresses that have been sent to server and returned, so that data can persist after refresh

**Other**

Add price filter suggestor feature
1) see if price filter number can be altered, if so then:
* highlight price built in price filter with color so user notices it
* display text explaining price county of current search parameter 
* create switch/button that activates/deactivates autofill from plugin data for every search
* use county data returned by USDA to set price, maybe display it as well?
* ask jacob for relvant pdf, set up way for Jacob to update prices as they change (contact USDA and see if they want to help update?)


*IRELEVANT TO PROJECT BUT TRIED TO figure if zillow is displaying counties in a useable way (just checked and found a county tag at the bottom of the page that does not update until the page refreshes, would require force refresh to use...)
  *contact zillow to report as bug?

