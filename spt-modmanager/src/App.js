import './App.css';
import Card from './components/Card.js'
import modData from './data/data.json'
import Container from 'react-bootstrap/Container'

function App() {
  return (
    <div className="App">
      <Container>
        <Card data={modData}/>
      </Container>
    </div>
  );
}

export default App;
