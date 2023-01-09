
// import { ReactSession } from 'react-client-session';
// const port = ReactSession.get("serverPort");
const port = 8080;


const get = async (api, args) => {
    let url = "http://localhost:"+ port + "/api/v1" + api + "?" + new URLSearchParams(args);
    console.log("Sending GET request to url: " + url);
    const response = await fetch(url, {
      method: 'get',
      mode: 'cors',
    });
  
    let json = await response.json();
    console.log("Got json:", json);
    json.status = response.status;
    return json;
}

export default get