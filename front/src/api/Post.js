// import { ReactSession } from 'react-client-session';
const port = 32221;

const post = async (api, args, token) => {
    let url = "http://localhost:"+ port + "/api/v1" + api;
    console.log("Sending POST request to url: " + url);
    const response = await fetch(url, {
      method: 'post',
      headers: {'Content-Type':'application/json', 'Authorization': "Bearer " + token},
      mode: 'cors',
      body: JSON.stringify(args),
    });
    let json = await response.json();
    json.status = response.status;
    console.log("Got json:", json);
    return json;
} 

export default post