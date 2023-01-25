
import { ReactSession } from 'react-client-session';


const checkAuth = () => {
    return ReactSession.get("token") === undefined;
}

export default checkAuth