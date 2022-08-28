import './App.css';
import {Routes,Route} from "react-router-dom"
import Picsets from "./component/Picsets"
import Roles from "./component/Roles"
import Admin from "./Admin.js"
import Pictures from "./component/Pictures"
import Login from "./component/Login"


function App() {
  return (
    <Routes>      
      <Route path="/" element={<Admin />}>
        <Route index element={<Picsets />} />
        <Route path="/picSets" exact element={<Picsets />} >
        </Route>
        <Route path="/roles" element={<Roles />} />
        <Route path="/picSets/pictures" element={<Pictures/>}/>        
      </Route> 
      <Route path="/login" element={<Login/>}/>    

    </Routes>
    
    
  );
}

export default App;
