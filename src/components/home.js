import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../Style/HomeForm.css'
import axios from 'axios';
import 'react-bootstrap/'
import 'bootstrap/dist/css/bootstrap.min.css';


const Home = () => {

    const location = useLocation()

    // State for contact info
    const [contactInfo, setContactInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateTime: ''
    });

    // State for checkbox list
    const [items, setItems] = useState([
        { name: 'Item 1', cost: 10 },
        { name: 'Item 2', cost: 20 },
        { name: 'Item 3', cost: 30 },
        { name: 'Item 4', cost: 40 },
        { name: 'Item 5', cost: 50 },
    ]);



    // State for search input
    const [searchTerm, setSearchTerm] = useState('');

    // Function to handle input change in contact info section
    const handleContactInfoChange = (e) => {
        const { name, value } = e.target;
        setContactInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle checkbox toggle
    const handleCheckboxToggle = (index) => {
        const updatedItems = [...items];
        updatedItems[index].selected = !updatedItems[index].selected;
        setItems(updatedItems);
    };

    // Function to filter items based on search term
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Functions to manage changes in the checkbox
    const [products, setProducts] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [totalCostProductos, setTotalCostProductos] = useState(0);
    const [totalCostServicios, setTotalCostServicios] = useState(0);
    const [countProductos, setCountProductos] = useState(0);
    const [countServicios, setCountServicios] = useState(0);
    const [discountValueProductos, setDiscountValueProductos] = useState(0);
    const [discountValueServicios, setDiscountValueServicios] = useState(0);


    useEffect(() => {
        fetch('http://localhost:8080/getProducts')
            .then(response => response.json())
            .then(data => {
                // Initialize checkedItems object with false values for each product
                const initialCheckedItems = {};
                let productosCount = 0;
                let serviciosCount = 0;

                data.forEach(product => {
                    initialCheckedItems[product._id] = false;
                    if (product.type === "productos-x") {
                        productosCount++;
                    } else if (product.type === "servicios-x") {
                        serviciosCount++;
                    }
                });

                setProducts(data);
                setCheckedItems(initialCheckedItems);
                setCountProductos(productosCount);
                setCountServicios(serviciosCount);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    useEffect(() => {
        // Calculate total cost for productos and servicios when checkedItems state changes
        let sumProductos = 0;
        let sumServicios = 0;
        Object.keys(checkedItems).forEach(itemId => {
            if (checkedItems[itemId]) {
                const product = products.find(product => product._id === itemId);
                if (product.type === "producto") {
                    sumProductos += product.cost;
                } else if (product.type === "servicio") {
                    sumServicios += product.cost;
                }
            }
        });
        setTotalCostProductos(() => sumProductos);
        setTotalCostServicios(() => sumServicios);
    }, [checkedItems, products]);

    const handleCheckboxChange = (itemId, itemType) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId]
        }));

        if (itemType === "producto") {
            setCountProductos(prevCountProductos => checkedItems[itemId] ? prevCountProductos - 1 : prevCountProductos + 1);
        } else if (itemType === "servicio") {
            setCountServicios(prevCountServicios => checkedItems[itemId] ? prevCountServicios - 1 : prevCountServicios + 1);
        }
    };

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

    // Discount management area
    const calculateDiscount = () => {
        if (countProductos >= 2 && totalCostProductos > 1500) {
            setDiscountValueProductos(5); 
        } else if (countProductos >= 2) {
            setDiscountValueProductos(3); 
        } else {
            setDiscountValueProductos(0); 
        }

        if (countServicios >= 5) {
            setDiscountValueServicios(5); 
        } else if (countServicios >= 2) {
            setDiscountValueServicios(3); 
        } else {
            setDiscountValueServicios(0); 
        }
    };

    // Update discount value whenever theres a change
    useEffect(() => {
        calculateDiscount();
    }, [countProductos, countServicios, totalCostProductos]);


    // Function to handle button click
    const handleSubmit = () => {
        const dataObject = {
            correo: contactInfo.email,
            nombrex: contactInfo.name,
            apellido: contactInfo.lastName, 
            fecha: contactInfo.dateTime,
            costo: totalCostProductos+totalCostServicios
          };

        fetch('http://localhost:8080/submit-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataObject) // Replace with your data object
        })
            .then(response => {
                if (response.ok) {
                    console.log('Data sent successfully');
                } else {
                    console.error('Failed to send data');
                }
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
    };

    //RETURN SPEC
    return (
        <div className="page-container">
            <div className="banner">
                <div className="logo"></div>
                <div>
                    <h1>Disagro</h1>
                    <h7>Feria de promociones 2024</h7>
                </div>
            </div>
            {/* Left Section: Contact Info */}
            <div className="left-section">
                <h2>Contact Info</h2>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={contactInfo.firstName}
                        onChange={handleContactInfoChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={contactInfo.lastName}
                        onChange={handleContactInfoChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactInfo.email}
                        onChange={handleContactInfoChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dateTime">Date and Time:</label>
                    <input
                        type="datetime-local"
                        id="dateTime"
                        name="dateTime"
                        value={contactInfo.dateTime}
                        onChange={handleContactInfoChange}
                    />
                </div>
            </div>

            {/* Right Section: Checkbox List with Search */}
            <div className="right-section">
                <h2>Productos y servicios</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="combo-box-container">
                    <ul className="items-list">
                        {products
                            .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(product => (
                                <li key={product._id}>
                                    <input
                                        type="checkbox"
                                        id={product._id}
                                        checked={checkedItems[product._id]}
                                        onChange={() => handleCheckboxChange(product._id, product.type)}
                                    />
                                    <label htmlFor={product._id}>
                                        <strong>{product.name}</strong> - ${product.cost}
                                    </label>
                                </li>
                            ))}
                    </ul>
                </div>
                <div>
                    <strong>Productos seleccionados:</strong> {countProductos} - <strong>monto total:</strong> ${totalCostProductos}
                </div>
                <div>
                    <strong>Servicios seleccionados: </strong> {countServicios} - <strong> monto total:</strong> ${totalCostServicios}
                </div>
                <div className="percentage-boxes-container">
                    <div className="percentage-box">
                        <div><strong>Descuento en productos</strong></div>
                        <div>{discountValueProductos}%</div>
                    </div>
                    <div className="percentage-box">
                        <div> <strong>Descuento en servicios</strong></div>
                        <div>{discountValueServicios}%</div>
                    </div>
                </div>
            </div>

            <div className="submit-button-container">
                <button className="submit-button"
                onClick={handleSubmit}
                >   
                <strong>CONFIRMAR ASISTENCIA</strong> </button>
            </div>
            <div className="footer">
                <p>© 2024 My Page. All rights reserved.</p>
            </div>
        </div>
    );


};

export default Home;