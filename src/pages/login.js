import react,{useState} from 'react'
import { Link,useHistory } from 'react-router-dom'
import "../styles/login.css"
import axios from 'axios'
import { Container } from 'react-bootstrap'
import Swal from 'sweetalert2'


function Login () {
    const [login, setLogin] = useState({
        email:'',
        password:''
    })
    
    const handleChange = (e) => {
       setLogin({...login,[e.target.name]:e.target.value})
    }
    const history = useHistory()

    const logins = async() => {
        try {
            if((login.email == "") || (login.register == "")){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'You must complete the login form'
                  })
            }
            else{
            const response = await axios.post("https://nutech12345.herokuapp.com/api/v1/login",{email:login.email,password:login.password})
            localStorage.setItem("token",response.data.data.token)
            history.push("/")
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
              Toast.fire({
                icon: 'success',
                title: 'Signed in successfully'
              })
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'email or password incorect'
              })
        }
    }

 
    return(
        <div className='flex-center'>
            <div className='square'>
                <p className='text-login'>Login</p>
                <input type="text" className="input-login" placeholder='Email' name='email' value={login.email} onChange={(e)=>handleChange(e)}></input>
                <input type="password" className="input-login" placeholder='Password' name='password' value={login.password} onChange={(e)=>handleChange(e)}></input>
                <div className='button-login' onClick={()=>logins()}>Login</div>
                <p style={{fontSize:"15px",marginButtom:"5vh"}} >If you dont have an account <Link to={"/register"}><span  className='sign-up'>Sign up</span></Link></p>
            </div> 
        </div>
    )
}

export default Login

export const isAuth = () => {
    if (localStorage.getItem('token')) {
    return true;
    }
    else{
    return false;
    }
}