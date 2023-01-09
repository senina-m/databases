import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/autorization/login/LoginPage';
import RegisterPage from './components/autorization/register/RegisterPage';
import MainPage from './components/MainPage';
import PageNotFound from './components/PageNotFound';
import CreaturesPage from './components/CreaturesPage';
import CrimesPage from './components/CrimesPage';
import InfoPage from './components/InfoPage';
import CreatePage from './components/CreatePage';
import { ReactSession } from 'react-client-session';


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
        <Route path="/info" element={<InfoPage/>}/>
        <Route path="/create" element={<CreatePage/>}/>
        <Route path="*" element={<PageNotFound/>} status={404}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
