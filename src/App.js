import './App.css';
import {Routes , Route} from "react-router-dom"
import RegisterPage from './Components/RegisterPage';
import Layout from './Components/Layout';
import ScoreboardTable from './Components/ScoreboardTable';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/"  element={<RegisterPage />} />
        <Route path="/game-page"  element={ <Layout />} />
        <Route path="/scoreboard"  element={ <ScoreboardTable />} />
      </Routes>
      
    </div>
  );
}

export default App;
