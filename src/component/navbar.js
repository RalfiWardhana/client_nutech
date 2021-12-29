import {Navbar,NavDropdown,Nav,Container} from "react-bootstrap"
import {Link, useHistory} from 'react-router-dom'
function Navbars () {
    const history = useHistory()
    const logout = () => {
      localStorage.removeItem("token");
      history.push("/")
    }
    return(
     <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand><Link to={"/"} style={{color:"white",textDecoration:"none"}}>Nutech Integrasi</Link></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text style={{cursor:"pointer"}} onClick={()=>logout()}>
              Logout
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}
export default Navbars