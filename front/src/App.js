import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/autorization/login/LoginPage';
import RegisterPage from './components/autorization/register/RegisterPage';
import MainPage from './components/MainPage';
import PageNotFound from './components/PageNotFound';

function App() {
  const serverPort = 8080;
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" exact element={<LoginPage serverPort={serverPort}/>}/>
        <Route path="/register" element={<RegisterPage serverPort={serverPort}/>}/>
        <Route path="/main" element={<MainPage serverPort={serverPort}/>}/>
        <Route path="*" element={<PageNotFound/>} status={404} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
