import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/autorization/login/LoginPage';
import RegisterPage from './components/autorization/register/RegisterPage';
import MainPage from './components/MainPage';
import PageNotFound from './components/PageNotFound';
import CreaturesPage from './components/contents/creatures/CreaturesPage';
import CrimesPage from './components/contents/crimes/CrimesPage';
import InfoPageCrime from './components/contents/crimes/InfoPageCrime';
import CreatePage from './components/contents/create/CreatePage';
import Forbidden from './components/Forbidden';
import { ReactSession } from 'react-client-session';
import CreatureEditForm from './components/contents/creatures/CreatureEditForm';
import CrimeEditForm from './components/contents/crimes/CrimeEditForm';
import Relogin from './components/Relogin';
import CreatureInfoPage from './components/contents/creatures/CreatureInfoPage';
import UserInfoPage from './components/contents/UserInfoPage';


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
        <Route path="/crime" element={<InfoPageCrime/>}/>
        <Route path="/create" element={<CreatePage/>}/>
        <Route path="/edit/creature" element={<CreatureEditForm/>}/>
        <Route path="/edit/crime" element={<CrimeEditForm/>}/>
        <Route path='/forbidden' element={<Forbidden/>}/>
        <Route path='/relogin' element={<Relogin/>}/>
        <Route path='/info/creature' element={<CreatureInfoPage/>}/>
        <Route path='/info' element={<UserInfoPage/>}/>
        <Route path="*" element={<PageNotFound/>} status={404}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;