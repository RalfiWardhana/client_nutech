import { useState } from "react"
import axios from "axios"
import {useHistory,Link} from "react-router-dom"
import "../styles/login.css"
import Swal from 'sweetalert2'

function Register () {
    const [register, setRegister] = useState({
        name:'',
        password:'',
        email:''
    })
    
    const handleChange = (e) => {
       setRegister({...register,[e.target.name]:e.target.value})
    }
    const history = useHistory()

    const registers = async () => {
       try {
        const config ={
            headers:{
                "Content-Type" : "application/json"
            }
        }
        const body = JSON.stringify(register)
        const response = await axios.post("https://nutech12345.herokuapp.com/api/v1/register",body,config)
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
       } catch (error) {
           console.log(error)
           Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You must complete the register form'
          })
       }
    }

    return(
    <div className='flex-center'>    
        <div className='square-register'>
            <p className='text-login'>Register</p>
            <input type="text" className="input-login" placeholder='Name' name="name" value={register.name} onChange={(e)=>handleChange(e)}></input>
            <input type="password" className="input-login" placeholder='Password' name="password" value={register.password} onChange={(e)=>handleChange(e)}></input>
            <input type="text" className="input-login" placeholder='Email' name="email" value={register.email} onChange={(e)=>handleChange(e)}></input>
            <div className='button-register' onClick={()=>registers()}>Register</div>
            <p style={{fontSize:"15px",marginButtom:"5vh"}} >Back to <Link to={"/login"}><span  className='sign-up'>Sign in</span></Link></p>
        </div>  
    </div>     
    )
}

export default Register