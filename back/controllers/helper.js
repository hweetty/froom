
var https = require('https');
var key  = "?key=" + require("../../_private_api_keys.js").uw_api;
var base = "https://api.uwaterloo.ca/v2/buildings/";

exports.urlForBuildingRoom = function (building, room) {
    return base + building + "/" + room + "/courses.json" + key;
}

exports.sendRes = function (res, message, data, code)
{
    if (!code)
        code = 200;
    res.send ({
        code    : code,
        message : message,
        data    : data
    }, code);
}

// Not complete list. yet...
exports.BUILDINGS = {
    "DC" : [
         1350, 1351
    ],
    "M3" : [
        1006
    ],
    "MC" : [
        1056, 1085,
        2017, 2034, 2038, 2054, 2035, 2065, 2066, 
        3008, 3003,
        4020, 4021, 4040, 4042, 4041, 4044, 4045,
        4058, 4059, 4061, 4063, 4064, 4062, 4060
    ],
    "RCH": [
        101, 103, 105, 106, 109, 110, 112, 108,
        204,206, 207, 208, 209, 211, 212, 205,
        301, 305, 306, 308, 309, 302, 307 
    ]
}

// returns a number representing the time in 10 minute intervals
exports.timeFromString = function (str)
{
    var colonIndex = str.indexOf(":");
    if (colonIndex < 0) {
        console.log("error - couldn't find colon");
        return -1;
    }

    var hr = parseInt(str.substring(0, colonIndex));
    var min = parseInt(str.substring(colonIndex+1));

    var ret = Math.floor(hr*6 + min/10);
    return ret;
}
    
exports.daysFromString = function (str)
{
    str = str.toLowerCase().replace("th", "h"); 
    var possibles = ["m", "t", "w", "h", "f"];
    var ret = [];

    for(var i = 0; i < possibles.length; i ++)
    {
        if (str.indexOf(possibles[i]) >= 0)
            ret.push(i);
    }

    return ret;
}


exports.query = function (url, fn, userData)
{
    GET(url, function (result, success)
    {
        var dict = JSON.parse(result);
        if (success && dict && verifyResponse(dict))
        {
            fn(dict.data, userData);
        } else
        {
            console.log("error - bad data response");
        }
    });
}
function GET (url, fn)
{
    console.log("getting url: " + url +"\n");
    https.get(url, function(res)
    {
        var data = "";
        res.on('data', function(d) {
            data += d;
        });

        res.on('end', function (d) {
            fn(data, data!="");
        })

    }).on('error', function(e) {
        fn(null, false);
    });
}

function verifyResponse (dict) {
    return dict && dict.meta && dict.meta.status == "200";
}








// setTimeout(function(){test();}, 500);
// function test ()
// {
//     console.log("testing");
//     assert ([
//         ensureSimilarArray(daysFromString("th"), [3]),
//         ensureSimilarArray(daysFromString("mwt"), [0, 1, 2]),
//         ensureSimilarArray(daysFromString("tth"), [1, 3]),
//         ensureSimilarArray(daysFromString("mtwthf"), [0, 1, 2, 3, 4]),
//         ensureSimilarArray(daysFromString("t"), [1])
//     ]);

//     assert ([
//         timeFromString("10:24") == 62,
//         timeFromString("8:30") == 51,
//         timeFromString("9:20") == 56,
//         timeFromString("12:30") == 75,
//         timeFromString("14:20") == 86,
//         timeFromString("14:30") == 87,
//     ]);

//     console.log("tests done\n\n");
// }


// function ensureSimilarArray (arr1, arr2)
// {
//     for (var i = 0; i < arr1.length; i ++)
//     {
//         if (arr2.indexOf(arr1[i]) < 0)
//             return false;
//     }

//     return true;
// }

// function assert (tests)
// {
//     for (var i = 0; i < tests.length; i ++)
//         if (!tests[i])
//             console.log("error in test :", i);
// }



