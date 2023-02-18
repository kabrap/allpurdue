import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Categories from './pages/Categories';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;