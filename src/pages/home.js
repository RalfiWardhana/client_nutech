import Navbars from '../component/navbar'
import {Form,Button,Table, Container,Modal} from "react-bootstrap"
import "../styles/home.css"
import{API,setAuthToken} from "../config/api"
import { useEffect,useState } from 'react'
import { Link} from 'react-router-dom'
import Swal from 'sweetalert2'

function Home () {
    const [barang, setBarang] = useState([])
    const [search,setSearch] = useState({
        input:""
    })
    const[validSearch, setValidSearch] = useState(false)
    const getBarang = async() => {
        try {
            const token = localStorage.getItem("token");
            setAuthToken(token)
            const response = await API.get("/barangs")
            setBarang(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const searching = () => {
        setValidSearch(true)
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showDelete, setShowDelete] = useState(false);
    const [idDelete, setIdDelete] = useState(null)

    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = (id) => {
        setShowDelete(true);
        setIdDelete(id)
    }
    const [add, setAdd] = useState ({
        name:"",
        harga_jual:"",
        harga_beli:"",
        stock:""
    })
    const [photo,setPhoto] = useState(null)
    
    const handleChange = (e) => {
        setAdd({...add,[e.target.name]:e.target.value})
    }

    const [state,setState] = useState(null)
    const imageHandler = (e) => {
        const reader = new FileReader()
        reader.onload = () => {
            if(reader.readyState == 2) {
                setState(reader.result)
                setPhoto(e.target.files[0])
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    const handleSearch = (e) => {
        if(e.target.value == ""){
            setValidSearch(false)
        }
        setSearch({...search,[e.target.name]:e.target.value})
    }
    const adding = async(e) => {
         try {
             if((add.name || add.harga_beli || add.harga_jual || add.stock) == ""){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'You must complete this add form'
                  })
             }
             else if((add.name && add.harga_beli && add.harga_jual && add.stock) == ""){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'You must complete this add form'
                  })
             }
             else{
             const token = localStorage.getItem("token");
             setAuthToken(token)
             const config ={
                    headers:{
                        "Content-Type" : "multipart/form-data"
                    }
                }    
             const formData = new FormData()
             formData.append("photo", photo);
             formData.append("name", add.name);
             formData.append("harga_jual", add.harga_jual);
             formData.append("harga_beli", add.harga_beli);
             formData.append("stock", add.stock);
             const resp = await API.post("/barang",formData,config)
             console.log(resp.data)
             const response = await API.get("/barangs")
             setBarang(response.data.data)
             setAdd({
                name:"",
                harga_jual:"",
                harga_beli:"",
                stock:""
             })
             setState(null)
             setPhoto(null)
             setShow(false)
             Swal.fire(
                'Success to add!',
                'You clicked the button!',
                'success'
              )
             } 
         }catch(error){
             console.error();
             Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You must upload png or jpg Max 100 Kb!'
              })
         }
      }
    
    const deletes = async(id) => {
        try {
            const token = localStorage.getItem("token");
            setAuthToken(token)
            const resp = await API.delete("/barang/"+id)
            const response = await API.get("/barangs")
            setBarang(response.data.data)
            setIdDelete(null)
            setShowDelete(false);
            setCurrentPage(1)
            Swal.fire(
                'Success to Delete!',
                'You clicked the button!',
                'success'
              )

        } catch (error) {
            console.log(error)
        }
    }

      
    useEffect(()=>{
        getBarang()
    },[])
    let i = 1

    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage, setPostPerPage] = useState(5)
    const [inputPerPage, setInputPerPage] = useState({
        input:""
    })
    
    const indexOfLastPost = currentPage * postPerPage
    const indexOfFirstPost = indexOfLastPost - postPerPage
    
    const currentPost = barang.slice(indexOfFirstPost,indexOfLastPost)
    const pageNumbers = []

    for(let i = 1 ; i <= Math.ceil(barang.length/postPerPage); i++){
        pageNumbers.push(i)
    }

    const pagination = (pageNumber) => {
        setCurrentPage(pageNumber)
    }


    const result = () => {
        let resl = barang.filter((bar)=> bar.name.toLowerCase().includes(search.input.toLowerCase()) || bar.harga_beli.toString().includes(search.input.toLowerCase()) || bar.harga_jual.toString().includes(search.input.toLowerCase()) || bar.stock.toString().includes(search.input.toLowerCase()) )
        return resl
    }

    const rupiahFormat = (value) => {
        var	reverse = value.toString().split('').reverse().join(''),
        ribuan 	= reverse.match(/\d{1,3}/g);
        ribuan	= ribuan.join(',').split('').reverse().join('');
        return ribuan
    }

    return(
          <>
          <Navbars/>   
          <Container>    
          <div className='flex-home'>
             <Button variant="primary" onClick={handleShow}>Add</Button>
             <Form.Control type="text" placeholder="Search.." style={{width:"80vh"}} name="input" value={search.input} onChange={(e)=>handleSearch(e)}  />
             <Button variant="primary" onClick={()=>searching()}>Search</Button>         
          </div>
          
          {((result().length == 0) || (barang.length == 0) || (currentPost.length == 0)) ? (
              <div>
                    <img src="/nodata.png" width="500px" height="300px"></img>
              </div>
          ): 
          <Table striped hover size="sm" responsive>
            <thead style={{backgroundColor:"#478cb8",color:"white"}}>
                <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Buy Price</th>
                    <th>Sell Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {(validSearch == false) ?  (
                currentPost.map((brg)=>(
                 <tr>
                    <td>{barang.indexOf(brg)+1}</td>
                    <td><img src={brg.photo} className='photo'></img></td>
                    <td>{brg.name}</td>
                    <td>Rp. {rupiahFormat(brg.harga_beli)}</td>
                    <td>Rp. {rupiahFormat(brg.harga_jual)}</td>
                    <td>{brg.stock}</td>
                    <td><div className='flex-button'>
                          <Link to={"/edit/"+brg.id} className='edit-button'><div>Edit</div></Link>
                          <div className='delete-button' onClick={()=>handleShowDelete(brg.id)}>Delete</div>
                        </div>
                    </td>
                </tr>
                ))):(validSearch == true) ? (   
                result().map((brg)=>(
                <tr>
                    <td>{i++}</td>
                    <td><img src={brg.photo} className='photo'></img></td>
                    <td>{brg.name}</td>
                    <td>Rp. {rupiahFormat(brg.harga_beli)}</td>
                    <td>Rp. {rupiahFormat(brg.harga_jual)}</td>
                    <td>{brg.stock}</td>
                    <td><div className='flex-button'>
                          <Link to={"/edit/"+brg.id} className='edit-button'><div>Edit</div></Link>
                          <div className='delete-button' onClick={()=>handleShowDelete(brg.id)}>Delete</div>
                        </div>
                    </td>
                </tr>
                )))
                :null
                }
            </tbody>
            </Table>
            }
            <div>
                <nav>
                    <ul className='pagination'>
                        {pageNumbers.map(number => (
                            <li className='page-item'>
                                <a onClick={()=>pagination(number)} style={{cursor:"pointer"}} className='page-link'>{number}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            </Container>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Control type="text" placeholder="Product Name" className="mb-3" name="name" value={add.name} onChange={(e)=>handleChange(e)} />
                <Form.Control type="number" placeholder="Buy price" className="mb-3" name="harga_beli" value={add.harga_beli} onChange={(e)=>handleChange(e)}  />
                <Form.Control type="number" placeholder="Sell price" className="mb-3" name="harga_jual" value={add.harga_jual} onChange={(e)=>handleChange(e)} />
                <Form.Control type="number" placeholder="Stock" className="mb-3" name="stock" value={add.stock} onChange={(e)=>handleChange(e)}  />
                <Form.Group controlId="formFileSm" className="mb-3" name="photo" >
                    <Form.Label>Input Photo Product</Form.Label>
                    <Form.Control type="file" size="sm" onChange={(e)=> imageHandler(e)} />
                </Form.Group>
                {(state == null) ? (
                    <img src={state} style={{display:"none"}}></img>
                ):
                <img src={state} style={{width:"70px", height:"100px",border:"2px solid black"}}></img>
                }              
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>adding()}>Add</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Body>Are you sure want to delete this item</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDelete}>
                    Close
                </Button>
                <Button variant="danger" onClick={()=>deletes(idDelete)}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
          
          
          </>  
    )
}

export default Home