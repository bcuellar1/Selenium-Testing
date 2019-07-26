const chrome = require('selenium-webdriver/chrome')
const webdriver = require('selenium-webdriver')
const clearCache = require('selenium-chrome-clear-cache');
const By = webdriver.By;
var Keys = webdriver.Key
var map = webdriver.promise.map;
var email_counter = 0
var default_option = 2
var global_traversal = 0
var product_index = 0;
var global_counter = 0
// need an array of different options with xpaths
// need a global traversal 
var base_url = ('https://kudos.inc.com/shop/');

var usage_array = 
[ ["Primary Logo", 2],
  ["Cigar Band", 2,],
  ["Color Stacked", 2],
  ["Medallion",2],
  ["Logo Package", 2],
  ["Custom Seal", 2],
  ["Custom Logo Package", 2],
]


var chromeCapabilities = webdriver.Capabilities.chrome();
//setting chrome options to start the browser fully maximized
var chromeOptions = {
    // 'args': ['--test-type', '--start-maximized'],
    'w3c': false
};
chromeCapabilities.set('chromeOptions', chromeOptions);
let driver = new webdriver.Builder()
.withCapabilities(chromeCapabilities)
.build()

async function main() {
  // Example code to get to a website 
  // driver.get('https://www.google.com')

  // var element = driver.findElement(webdriver.By.name('q'));
  // element.sendKeys('Cheese!\n');

  driver.get(base_url)
  
  //driver.findElement(By.xpath("/html/body")).sendKeys(Keys.COMMAND +"t");


  // var navbar = driver.findElement(webdriver.By.className('navbar-toggle'));
  // navbar.click();

  // var product_1 = driver.findElement(webdriver.By.className('woocommerce-LoopProduct-link'));
  // console.log("PRod", product_1);


  //gets all product names by 'class name'
  var elems = driver.findElements(By.css(".woocommerce-LoopProduct-link"));

    
  

  //console.log(i);
  //outputs an array of all elements found

  map(elems, (e,index) => {
    console.log(" on index: " +index)
    if(index === global_counter){
      product_index = index;
      a_function(e, index);
    }
  })
}


main();
async function a_function(e,index){
  //shopping cart, check_out, and submit will always be the same
  // have to create a way to choose mutltiple options
  
  //clicks the product from product page
  console.log("I have made it to first function")
  e.click();
  // driver.get('chrome://settings/clearBrowserData')
  // console.log("is it going to^")


  //need a open tab, manage cache button


  await add_to_cart(default_option);
  await shopping_cart();
  await check_out();
  await submit();
  await confirmation_page();
  await clearCache({webdriver, driver}, {cookies: true});
  email_counter++
  await multiple_options()
  console.log("finished all multiple options, need to clear cache")
  //await clearCache({webdriver, driver}, {cookies: true});
}


// SOLUTION for clicking a logo and picking its options!!!!
var add_to_cart = (option_to_select) => {
  return new Promise((resolve) => {
    
    const usage = driver.wait(webdriver.until.elementLocated(By.id("usage")),15000);
    const list = driver.wait(webdriver.until.elementLocated(By.id("list")), 15000);
    const c_box = driver.wait(webdriver.until.elementLocated(By.className("wcpa_check")), 15000);
    const next_p = driver.wait(webdriver.until.elementLocated(By.className("single_add_to_cart_button button alt")), 15000);
    Promise.all([
      list.click().then(() =>{
                                                      //this can be changed by a key 
          driver.findElement(webdriver.By.xpath("//*[@id='list']/option[2]")).click()
      }),
      c_box.click()
    ])
  
    .then((next_page) =>{
      usage.click().then(()=>{
        driver.findElement(webdriver.By.xpath("//*[@id='usage']/option[" + option_to_select + "]")).click().then(() =>{
          //this click ^ causes many issues because after 'usage' is clicked and selected, ^reference gets 
          //changed and is unknown, therefore 'usage' click has to be moved to promise.all then    
          next_p.submit();
          resolve();
        });
      });
    })
  })
}

var shopping_cart = () => {
  return new Promise((resolve) =>{
    const coupon_c = driver.wait(webdriver.until.elementLocated(By.xpath("//*[@id='coupon_code']")), 15000);
    const apply_c = driver.wait(webdriver.until.elementLocated(By.xpath("//*[@id='column-left']/table/tbody/tr[2]/td/div/button")), 15000);
    const next_p = driver.wait(webdriver.until.elementLocated(By.xpath("//*[@id='post-6']/div/div/div[2]/div[2]/div/a")), 15000);
    Promise.all([
      coupon_c.click(),
      coupon_c.sendKeys("freeshipping"),
      apply_c.click()
    ])
    .then(() => {
      next_p.click().then(() => {
        resolve()
      })
      
      //var act = new webdriver.Actions(driver);
      //act.mouseMove(driver.findElement(By.xpath("//*[@id='post-6']/div/div/div[2]/div[2]/div/a"))).click().build().perform()

      //need to have an explicit wait of 500 milliseconds or else function works 50% of the time
      //*[@id="post-6"]/div/div/div[2]/div[2]/div
      //*[@id="post-6"]/div/div/div[2]/div[2]/div
      //*[@id="post-6"]/div/div/div[2]/div[2]/div/a
      //parentElement.childNodes[1]
      //By.#post-6 > div > div > div.cart-collaterals > div.cart_totals > div > a
  
      // setTimeout(() => {
      //   console.log("trying js")
      //   //const next_p = driver.wait(webdriver.until.elementLocated(By.xpath("//label")),15000);
      //   next_p.click().then(() => {
      //     resolve()
      //   })
        
      // }, 5000);
    })
  })
}

//for check_out page, the input/text fields are coded differently, find by xpath returns a non-interactable field
//therefore to fix issue and write on the page need to use a different find method, I.E. by ID. Find by ID
//returns an interactable field 

var check_out = () => {
  return new Promise((resolve) =>{
    const first_name = driver.wait(webdriver.until.elementLocated(By.id("billing_first_name")), 15000);
    const last_name = driver.wait(webdriver.until.elementLocated(By.id("billing_last_name")), 15000);
    const billing_company = driver.wait(webdriver.until.elementLocated(By.id("billing_company")), 15000);
    const address = driver.wait(webdriver.until.elementLocated(By.id("billing_address_1")), 15000);
    const city = driver.wait(webdriver.until.elementLocated(By.id("billing_city")),15000);
    const zip = driver.wait(webdriver.until.elementLocated(By.id("billing_postcode")),15000);
    const phone = driver.wait(webdriver.until.elementLocated(By.id("billing_phone")),15000);
    const state_c = driver.wait(webdriver.until.elementLocated(By.xpath("//*[@id='billing_state_field']/span/span/span[1]/span/span[2]")), 15000);
    //promise.all executes everything in logical order
    //for some reason if you add in more promises the state choice stops working due to it being deselected
    //had to move the email and password fields to a seperate function
    Promise.all([
      first_name.click(),
      first_name.sendKeys("Bryan -- ScriptTest"),
      last_name.click(),
      last_name.sendKeys("Cuellar -- ScriptTest"),
      billing_company.click(),
      billing_company.sendKeys("Mansueto Ventures"),
      address.click(),
      address.sendKeys("123 Not a real Street"),
      city.click(),
      city.sendKeys("Faux City"),
      zip.click(),
      zip.sendKeys("12345"),
      phone.click(),
      phone.sendKeys("9876543210"),
      state_c.click(),
    ])
    .then(() => {
      var state_choice = driver.findElement(By.xpath("/html/body/span/span/span[1]/input"))
      state_choice.sendKeys("California\n")
      // '\n' functions as a pseduo enter
      resolve()
    })
  })
}

var submit = () => {
  return new Promise((resolve) =>{
    const email_address = driver.wait(webdriver.until.elementLocated(By.id("billing_email")), 15000)
    const password = driver.wait(webdriver.until.elementLocated(By.id("account_password")), 15000)
    Promise.all([
      email_address.click(),
      email_address.sendKeys(email_counter +"fauxemail@fakeemaildomain.com"),
      password.click(),
      password.sendKeys("123456!@#$%"),
    ])
    .then(() => {
      //have to find the element after all items have been clicked and filled out or else 
      //we will get a stale element error, in general if you have a page with a lot of moving parts 
      //and you need to submit it or click a form to submit info, find the element after all information
      //has been clicked and filled out 
      //sometimes, submit button gives the element click intercepted error because of hidden fields
      //same issue as checkout, need a 500 millisecond implicit wait or else works 50% of the time
      setTimeout(() =>{
        const submit_button = driver.wait(webdriver.until.elementLocated(By.xpath("//*[@id='place_order']")), 15000)
        submit_button.click().then(() => {
          resolve()
        })
      },5000)
    })
  })
}

//Purpose of this function is to make sure we arrive to confirmation page then to clear cache, cookies, and history
var confirmation_page = () => {
  return new Promise((resolve) => {
    console.log("made it to confirmation function")
    //these guys get timed out after multilple runs 
    confirmation_one = driver.wait(webdriver.until.elementLocated(By.className("woocommerce-order-overview woocommerce-thankyou-order-details order_details")), 30000)
    confirmation_two = driver.wait(webdriver.until.elementLocated(By.className("woocommerce-order-downloads")), 30000)
    confirmation_three = driver.wait(webdriver.until.elementLocated(By.className("woocommerce-order-details")), 30000)
    confirmation_four = driver.wait(webdriver.until.elementLocated(By.className("woocommerce-order-details")),30000)
    console.log("going to resolve")
    resolve()
  })
}

var multiple_options = () =>{
  return new Promise((resolve) =>{
    let option_calls = default_option;
    if(--default_option === usage_array[global_traversal][1]){
      //if we arrive to this case, there are no more options to exhaust
      ++global_traversal;
      resolve()
    }else{
      //I need to go through multiple options, this enures that
      let num_of_iterations = usage_array[global_traversal][1] - option_calls + 1
      console.log("I do have to do stuff")
      console.log("I have to go through " + num_of_iterations + " more options")
      for(i = 0; i < num_of_iterations; i++){
        console.log("made it to loop " + i)
        ++option_calls;
        mul_options(option_calls)
      }
      ++global_traversal
      resolve()
    }
  })
}


//this function re-opens browser to home page and chooses the next options for one product
//Current Issue: opening/closing a browser 
async function mul_options(op_to_select){
  console.log("made it to function mul_options")
  //have to re-map everything
  driver.get('https://kudos.inc.com/shop/')
  var new_elems = driver.findElements(By.css(".woocommerce-LoopProduct-link"));
  map(new_elems, (new_e,new_index) => {
    if(product_index === new_index){
      console.log("I made it to the second map")
      new_e.click()
    }
  })
  console.log("I'm passing in " + op_to_select)
  await add_to_cart(op_to_select);
  await shopping_cart();
  await check_out();
  await submit();
  await confirmation_page();
  console.log("did the cache get cleared?")
}
