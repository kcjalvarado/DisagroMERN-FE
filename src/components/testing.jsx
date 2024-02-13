import React, { useEffect, useState } from "react";
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import '../Style/LoginFrom.css'


const Tests = () => {
    
    const [products, setProducts] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [totalCostProductos, setTotalCostProductos] = useState(0);
  const [totalCostServicios, setTotalCostServicios] = useState(0);
  const [countProductos, setCountProductos] = useState(0);
  const [countServicios, setCountServicios] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/getProducts')
      .then(response => response.json())
      .then(data => {
        // Initialize checkedItems object with false values for each product
        const initialCheckedItems = {};
        let initialCountProductos = 0;
        let initialCountServicios = 0;
        data.forEach(product => {
          initialCheckedItems[product._id] = false;
          if (product.type === "productos") {
            initialCountProductos++;
          } else if (product.type === "servicios") {
            initialCountServicios++;
          }
        });
        setProducts(data);
        setCheckedItems(initialCheckedItems);
        setCountProductos(initialCountProductos);
        setCountServicios(initialCountServicios);
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

    

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="bg-success text-white p-1 justify-content-start">
        <div className="container-fluid">
          <h2>DISAGRO</h2>
          <p>Feria 1</p>
        </div>
      </header>
      <div className="container mt-5 flex-grow-1">
        <h1 className="mb-4">Products</h1>
        <div className="row justify-content-center">
          <div className="col-md-6" style={{ width: '40%' }}>
            <div className="card h-100">
              <div className="card-body">
                <h2 className="card-title">Contact Information</h2>
                <div className="mb-3">
                  <input type="text" className="form-control mb-2" placeholder="Name" />
                  <input type="text" className="form-control mb-2" placeholder="Lastname" />
                  <input type="email" className="form-control mb-2" placeholder="Email" />
                  <input type="datetime-local" className="form-control mb-2" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6" style={{ width: '40%' }}>
            <div className="card h-100">
              <div className="card-body">
                <h2 className="card-title">Products</h2>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <ul className="list-unstyled">
                  {products
                    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(product => (
                      <li key={product._id} className="mb-2">
                        <input
                          type="checkbox"
                          id={product._id}
                          checked={checkedItems[product._id]}
                          onChange={() => handleCheckboxChange(product._id, product.type)}
                        />
                        <label htmlFor={product._id} className="ms-2">
                          <strong>{product.name}</strong> - ${product.cost}
                        </label>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4 justify-content-end">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Discount 1</h2>
                {/* Placeholder for discount value */}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Discount 2</h2>
                {/* Placeholder for discount value */}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3 justify-content-center">
          <div className="col-md-6">
            <button className="btn btn-lg btn-primary">Inscribir</button>
          </div>
        </div>
      </div>
      <footer className="bg-success text-white p-1">
        <div className="container text-left">
          <h5>Footer</h5>
        </div>
      </footer>
    </div>
  );
};

export default Tests;