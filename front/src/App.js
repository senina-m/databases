import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/autorization/login/LoginPage';
import RegisterPage from './components/autorization/register/RegisterPage';
import MainPage from './components/MainPage';
import PageNotFound from './components/PageNotFound';
import CreaturesPage from './components/creatures/CreaturesPage';
import CrimesPage from './components/contents/CrimesPage';
import InfoPageCreature from './components/contents/InfoPageCreature';
import CreatePage from './components/contents/create/CreatePage';
import Forbidden from './components/contents/Forbidden';
import { ReactSession } from 'react-client-session';
import CreatureEditForm from './components/creatures/CreatureEditForm';
import Relogin from './components/Relogin';


function App() {
  ReactSession.setStoreType("sessionStorage");
  ReactSession.set("serverPort", 8080);
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" exact element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/main" element={<MainPage/>}/>
        <Route path="/creatures" element={<CreaturesPage/>}/>
        <Route path="/crimes" element={<CrimesPage/>}/>
        <Route path="/info" element={<InfoPageCreature/>}/>
        <Route path="/create" element={<CreatePage/>}/>
        <Route path="/edit/creature" element={<CreatureEditForm/>}/>
        <Route path='/forbidden' element={<Forbidden/>}/>
        <Route path='/relogin' element={<Relogin/>}/>
        <Route path="*" element={<PageNotFound/>} status={404}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
