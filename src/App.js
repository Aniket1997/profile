import SignUp from './Component/Pages/SignUp';
import Login from './Component/Pages/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    // <SignUp/>
    <Router>
      <Routes>
        <Route exact path="/" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
