
import { ReactSession } from 'react-client-session';


const checkWriter = () => {
    console.log("role", ReactSession.get("permission"))
    return ReactSession.get("permission") !== "writer"
}

export default checkWriter