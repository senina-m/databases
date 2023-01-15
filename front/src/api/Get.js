
// import { ReactSession } from 'react-client-session';
// const port = ReactSession.get("serverPort");
const port = 8080;


const get = async (api, args, token) => {
    let url = "http://localhost:"+ port + "/api/v1" + api;
    if(!chekEmpty(args)){
      url = url + "?" + new URLSearchParams(args);
    }
    console.log("Sending GET request to url: " + url);
    // return fetch(url, {
    //   method: 'get',
    //   mode: 'cors',
    //   headers: {'Authorization' : "Bearer " + token}
    // }).then((response) =>{
    //   response.json().then((json) => {
    //     console.log("Got json:", json);
    //     json.status = response.status;
    //     return json;
    //   }).catch(()=>{
    //     console.log("Can't convert response json to js obj");
    //     throw new Error("Can't convert response json to js obj");
    //   });
    // }).catch(()=>{
    //   console.log("Didn't resive a response for get request.");
    //   throw new Error("Didn't resive a response for get request.");
    // });
    try{
      const response = await fetch(url, {
        method: 'get',
        mode: 'cors',
        headers: {'Authorization' : "Bearer " + token},
      });
      let json = await response.json();
      json.status = response.status;
      console.log("Got json:", json);
      return json;
    }catch(e){
      throw new Error("Can't resive server data");
    }
}

export default get

let chekEmpty = (obj) => {
  for(var i in obj) return false; 
  return true;
}