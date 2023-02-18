import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Categories from './pages/categories/Categories';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Cafes from './pages/categories/Cafes'
import Restaurants from './pages/categories/Restaurants'
import Residence from './pages/categories/Residence'
import Study from './pages/categories/Study'

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
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/categories/cafes" element={<Cafes />} />
          <Route path="/categories/restaurants" element={<Restaurants />} />
          <Route path="/categories/residence-halls" element={<Residence />} />
          <Route path="/categories/study-spots" element={<Study />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;