import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Categories from './pages/categories/Categories';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import LoginSignup from './pages/LoginSignup';
import Cafes from './pages/categories/Cafes'
import Restaurants from './pages/categories/Restaurants'
import Residence from './pages/categories/Residence'
import Study from './pages/categories/Study'
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <div className='app'>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loginsignup" element={<LoginSignup />} />
          <Route path="/categories/cafes" element={<Cafes />} />
          <Route path="/categories/restaurants" element={<Restaurants />} />
          <Route path="/categories/residence-halls" element={<Residence />} />
          <Route path="/categories/study-spots" element={<Study />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;