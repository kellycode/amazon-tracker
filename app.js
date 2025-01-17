// axios "Promise based HTTP client for the browser and node.js"
// Github: https://github.com/axios/axios
// Web Site: https://axios-http.com/
// NPM: https://www.npmjs.com/package/axios
const axios = require("axios");

// cheerio "The fast, flexible, and elegant library for parsing and manipulating HTML and XML.""
// Github: https://github.com/cheeriojs/cheerio
// Web Site: https://cheerio.js.org/
// NPM: https://cheerio.js.org/docs/basics/manipulation
const cheerio = require("cheerio");

// ora "Elegant terminal spinner"
// Github: https://github.com/sindresorhus/ora
// NPM: https://www.npmjs.com/package/ora
const ora = require("ora");

const Prices = {};

const lowPriceLogger = (newPrice) => {
    console.log("wew! go buy nowwww.... the new price is", newPrice);
};

const FetchPrice = (productUrl) => {
    const spinner = ora("Loading....").start();

    axios.get(productUrl).then(({ data }) => {
        // cheerio examples like const $ = cheerio.load(data);
        // but using '$' as a variable name can easily have conflicts
        // and it looks confusing when the app is using '$' with output
        const cheerio_Object = cheerio.load(data);

        // search id and classes likely need to be updated occasionally
        // returns one price or a concatenated list of prices
        // such as "$59.95" or "$59.95$19.95$39.95"
        // this needs to be validated or provide an indicator if undefined
        // but, for now the price outputs as "$undefined" so that is notification enough
        // to try again or check the url
        let thePriceText = cheerio_Object("#corePrice_feature_div .a-price .a-offscreen").text();

        // for testing the rarely undefined
        //console.log(thePriceText)

        // get the second one because the string starts with $
        const priceString = thePriceText.split("$")[1];

        // format the string
        const formattedPrice = "$" + thePriceText.split("$")[1];

        // get the actual number for later comparison
        const priceAsNumber = parseFloat(priceString);

        // if we keep the app running this checks
        // if the new price is lower than the last
        if (Prices[productUrl]) {
            if (Prices[productUrl] > priceAsNumber) {
                lowPriceLogger(formattedPrice);
            }
        }

        // save the price
        Prices[productUrl] = priceAsNumber;

        // truncate the text to the first 30 characters
        spinner.succeed("Item: " + cheerio_Object("title").text().substr(0, 30) + ": " + formattedPrice);
    });
};

// the search occasionally returns undefined  and then returns a valid response on next try
const PRODUCTS = [
    "https://www.amazon.com/dp/B0BVGCVVGM/?coliid=I15Z80LVX3SB1F&colid=3US7H6IHXAFD2&psc=1&ref_=list_c_wl_lv_ov_lig_dp_it",
    "https://www.amazon.com/dp/B07CRG94G3/?coliid=IN7DCROD8FRO7&colid=3US7H6IHXAFD2&ref_=list_c_wl_lv_ov_lig_dp_it",
    "https://www.amazon.com/dp/B0C14TF467/?coliid=I2ARL7JLERJ14M&colid=3US7H6IHXAFD2&ref_=list_c_wl_lv_ov_lig_dp_it"
];

const Track = () => {
    PRODUCTS.map((prod) => {
        FetchPrice(prod);
    });

    // keep the app running
    //setTimeout(Track, 300000);
};

// start it
Track();
