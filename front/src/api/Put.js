// import { ReactSession } from 'react-client-session';
const port = 32221;

const put = async (api, args_body, token) => {
    let url = "http://localhost:"+ port + "/api/v1" + api;
    console.log("Sending PUT request to url: " + url);
    const response = await fetch(url, {
      method: 'put',
      headers: {'Content-Type':'application/json', 'Authorization': "Bearer " + token},
      mode: 'cors',
      body: JSON.stringify(args_body),
    });
    let json = await response.json();
    json.status = response.status;
    console.log("Got json:", json);
    return json;
}

export default put;
