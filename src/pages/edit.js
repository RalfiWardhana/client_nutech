import { useEffect,useState } from 'react'
import "../styles/login.css"
import "../styles/edit.css"
import Navbars from '../component/navbar'
import {Form} from "react-bootstrap"
import{API,setAuthToken} from "../config/api"
import { useParams,useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

function Edit () {

    const [edit, setEdit] = useState ({
        name:"",
        harga_jual:"",
        harga_beli:"",
        stock:""
    })
    const [photo,setPhoto] = useState(null)
    const [state,setState] = useState(null)
    const params = useParams()
    const history = useHistory()
    const getBarang = async() => {
        try {
            const token = localStorage.getItem("token");
            setAuthToken(token)
            const response = await API.get("/barang/"+params.id)
            console.log(response)
            setEdit({
                name:response.data.data.name,
                harga_jual:response.data.data.harga_jual,
                harga_beli:response.data.data.harga_beli,
                stock:response.data.data.stock
            })
            setPhoto(response.data.data.photo)
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (e) => {
        setEdit({...edit,[e.target.name]:e.target.value})
    }
    const imageHandler = (e) => {
        const reader = new FileReader()
        reader.onload = () => {
            if(reader.readyState == 2) {
                setState(reader.result)
                setPhoto(e.target.files[0])
                console.log(e.target.files[0])
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }
   
    const edits = async(e) => {
        try {
            const token = localStorage.getItem("token");
            setAuthToken(token)
            const config ={
                headers:{
                    "Content-Type" : "multipart/form-data"
                }
            }
            const formData = new FormData()
            formData.append("photo", photo);
            formData.append("name", edit.name);
            formData.append("harga_jual", edit.harga_jual);
            formData.append("harga_beli", edit.harga_beli);
            formData.append("stock", edit.stock);
            const resp = await API.patch("/barang/"+params.id,formData,config)
            history.push("/")
            Swal.fire(
                'Success to Edit!',
                'You clicked the button!',
                'success'
              )
            
        }catch(error){
            console.error();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You must upload PHOTO png or jpg Max 100 Kb!'
              })
        }
     }


    useEffect(()=>{
        getBarang()
    },[])

    return(
        <>
          <Navbars/>
          <div className='flex-edit'>    
            <div className='square-edit'>
                <p className='text-edit'>Edit</p>
                <Form.Control type="text" placeholder="Product Name" className="mb-3" name="name" value={edit.name} onChange={(e)=>handleChange(e)}  />
                <Form.Control type="number" placeholder="Buy price" className="mb-3" name="harga_beli" value={edit.harga_beli} onChange={(e)=>handleChange(e)}    />
                <Form.Control type="number" placeholder="Sell price" className="mb-3" name="harga_jual" value={edit.harga_jual} onChange={(e)=>handleChange(e)}   />
                <Form.Control type="number" placeholder="Stock" className="mb-3" name="stock" value={edit.stock} onChange={(e)=>handleChange(e)}   />
                <Form.Group controlId="formFileSm" className="mb-3" name="photo" value={photo} onChange={(e)=> imageHandler(e)} >
                    <Form.Label>Input Photo Product</Form.Label>
                    <Form.Control type="file" size="sm" />
                </Form.Group>
                {(state == null) ? (
                    <img src={photo} style={{width:"70px", height:"100px",border:"2px solid black", marginBottom:"3vh"}}></img>
                ):
                <img src={state} style={{width:"70px", height:"100px",border:"2px solid black", marginBottom:"3vh"}}></img>
                }
                
                <div className='button-register' onClick={()=>edits()}>Edit</div>
            </div>  
        </div>   
        </>
    )
}

export default Edit