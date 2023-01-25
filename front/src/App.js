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
import Forbidden from './components/Forbidden';
import { ReactSession } from 'react-client-session';
import CreatureEditForm from './components/contents/creatures/CreatureEditForm';
import CrimeEditForm from './components/contents/crimes/CrimeEditForm';
import Relogin from './components/Relogin';
import CreatureInfoPage from './components/contents/creatures/CreatureInfoPage';
import UserInfoPage from './components/contents/info/UserInfoPage';
import DetectiveInfoPage from './components/contents/detective/DetectiveInfoPage';
import CriminalInfoPage from './components/contents/criminals/CriminalInfoPage';
import CreateCreatureContainer from './components/contents/creatures/CreateCreaturePage';
import CreateCrimePage from './components/contents/crimes/CreateCrimePage';
import CrimeInfoPage from './components/contents/crimes/info/CrimeInfoPage';
import DetectivesPage from './components/contents/detective/DetectivesPage';
import CreateDetectivePage from './components/contents/detective/CreateDetectivePage';
import AddDetectiveToCrime from './components/contents/detective/AddDetectiveToCrime';
import AddCriminalsToCrime from './components/contents/criminals/AddCriminalsToCrime';
import CreateCriminalPage from './components/contents/criminals/CreateCriminalPage';
import CriminalEditPage from './components/contents/criminals/CriminalEditPage';
import DetectiveEditPage from './components/contents/detective/DetectiveEditPage';


function App() {
  ReactSession.setStoreType("sessionStorage");
  ReactSession.set("serverPort", 8080);
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/main" element={<MainPage/>}/>
        <Route path='/info' element={<UserInfoPage/>}/>

        <Route path="/" exact element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path='/forbidden' element={<Forbidden/>}/>
        <Route path='/relogin' element={<Relogin/>}/>

        <Route path="/creatures" element={<CreaturesPage/>}/>
        <Route path="/crimes" element={<CrimesPage/>}/>
        <Route path='/detectives' element={<DetectivesPage/>}/>

        <Route path="/create/creature" element={<CreateCreatureContainer/>}/>
        <Route path="/create/crime" element={<CreateCrimePage/>}/>
        <Route path='/create/detective' element={<CreateDetectivePage/>}/>
        <Route path='/create/criminal' element={<CreateCriminalPage/>}/>

        <Route path="/edit/creature" element={<CreatureEditForm/>}/>
        <Route path="/edit/crime" element={<CrimeEditForm/>}/>
        <Route path="/edit/criminal" element={<CriminalEditPage/>}/>
        <Route path="/edit/detective" element={<DetectiveEditPage/>}/>

        <Route path='/info/creature' element={<CreatureInfoPage/>}/>
        <Route path='/info/crime' element={<CrimeInfoPage/>}/>
        <Route path='/info/detective' element={<DetectiveInfoPage/>}/>
        <Route path='/info/criminal' element={<CriminalInfoPage/>}/>

        <Route path='/detectives/add' element={<AddDetectiveToCrime/>}/>
        <Route path='/criminals/add' element={<AddCriminalsToCrime/>}/>
        <Route path="*" element={<PageNotFound/>} status={404}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
