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
    },
    async getRankings(region)
    {
        var rankingsResponse = await fetch(vlrAPIURL + "rankings/" + region);
        const parsedResponse = await rankingsResponse.json();
        //console.log(parsedResponse.data);
        return parsedResponse.data;
    }
}