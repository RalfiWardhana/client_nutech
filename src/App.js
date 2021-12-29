import logo from './logo.svg';
import './App.css';
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'
import Edit from './pages/edit'
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import PrivateRoute from "./privateRoute"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path={"/login"} component={Login}/>
          <Route exact path={"/register"} component={Register}/>
          <PrivateRoute exact path={"/"} component={Home}/>
          <PrivateRoute exact path={"/edit/:id"} component={Edit}/>
        </Switch>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
