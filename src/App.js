
import SignUp from './Component/Pages/SignUp';
import Login from './Component/Pages/Login';
import { BrowserRouter as Router, Route } from 'react-router-dom';


function App() {
  return (
    <>
  <Router>
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      {/* ... other routes */}
    </Router>
    </>
  );
}

export default App;
