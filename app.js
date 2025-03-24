const fs = require('fs');
let totalRequests = 0;
let request = 0;

let charac = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z'
  ]

function readExistingData() {
    try {
        if (fs.existsSync('wordv1.json')) {
            let data = fs.readFileSync('wordv1.json', 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error reading file:", error);
    }
    return [];
}
function readReqData() {
    try {
        if (fs.existsSync('reqv1.json')) {
            let data = fs.readFileSync('reqv1.json', 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error reading file:", error);
    }
    return [];
}

async function solve(curr, ans) {
    for (let i = 0; i < charac.length; i++) {
        if(request >= 10) {
            await new Promise(resolve => setTimeout(resolve, 6000));
            request = 0;
        }
        let response = await fetch(`http://35.200.185.69:8000/v1/autocomplete?query=${curr + charac[i]}`);
        let data = await response.json();
        request++;
        totalRequests++;
        console.log(curr + charac[i]);
        // console.log(data);
        try{
        if(data.results.length>0) {
            // console.log(data.results[0]);
            console.log(ans.length);
            console.log(totalRequests);
        }
        if (data.results.length === 10) {
            if(curr + charac[i] === data.results[0]) {
                ans.push(data.results[0]);
            }
            await solve(curr + charac[i], ans);
        } else {
            ans.push(...data.results);
        }
    } catch(e) {
        console.log(e);
        i--;
    }
    }
}

(async () => {
    let existingData = readExistingData();
    let existingReq = readReqData();
    for (let i = existingData.length; i < charac.length; i++) {
        existingData = readExistingData();
        existingReq = readReqData();
        let ans = [];
        totalRequests = 0;
        await solve(charac[i], ans);
        existingData.push(ans);
        existingReq.push(totalRequests);
        fs.writeFileSync('wordv1.json', JSON.stringify(existingData, null, 2), 'utf-8');
        fs.writeFileSync('reqv1.json', JSON.stringify(existingReq, null, 2), 'utf-8');
        console.log("Data saved to wordv1.json");
    }
})();