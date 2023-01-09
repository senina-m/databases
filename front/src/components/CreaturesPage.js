import CreatureTable from './CreatureTable'

const CreaturesPage = ({serverPort}) => {

  const data = getCreaturesList();

  return (
    <>
    <CreatureTable data={data}/>
    </>
  )
}

export default CreaturesPage

let getCreaturesList = async ({port}) => {
  let url = "http://localhost:"+ port +"/api/v1/creatures";
  console.log("Sending GET request to url: " + url);
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
  });

  let json = await response.json();
  console.log(json);
  return json;
}
