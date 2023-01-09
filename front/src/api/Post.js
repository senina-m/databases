// import { ReactSession } from 'react-client-session';
const port = 8080;

const post = async (api, args) => {
    let url = "http://localhost:"+ port + "/api/v1" + api;
    console.log("Sending POST request to url: " + url);
    const response = await fetch(url, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      mode: 'cors',
      body: JSON.stringify(args),
    });
    let json = await response.json();
    json.status = response.status;
    console.log("Got json:", json);
    return json;
} 

export default post