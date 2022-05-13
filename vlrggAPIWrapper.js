const fetch = require('node-fetch')
var vlrAPIURL = "https://vlrggapi.herokuapp.com/"

module.exports =
{
    async getNews()
    {
        var newsResponse = await fetch(vlrAPIURL + "news");
        const parsedResponse = await newsResponse.json();
        //console.log(parsedResponse.data.segments);
        return parsedResponse.data.segments;
    }
}