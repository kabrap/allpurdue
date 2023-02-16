import './App.css';
import Navbar from './components/navbar/Navbar'
import Card from './components/card/Card'
import bellTower from './images/bell-tower.gif'
import Search from './components/search/Search';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className='hero'>
        <div id="hero-col-left" className='col'>
          <p id="hero-heading">Find all the <br /> best places at</p>
          <p id="hero-purdue">Purdue</p>
          <p id="hero-desc">
            Whether it be a food place, a residence hall,
            or a study spot at Purdue, AllPurdue features
            a wide variety of locations in different categories
            containing ratings and reviews made by
            Boilermakers, as well as visitors and locals.
          </p>
          <Search />
        </div>
        <div id="hero-image" className='col'>
          <img id="bellTower" src={bellTower} alt="bell tower" />
        </div>
      </div>
      <div className='reviews'>
        <Card />
      </div>
    </div>
  );
}


export default App;
