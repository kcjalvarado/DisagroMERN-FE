import React, { useEffect, useState } from "react";
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import '../Style/LoginFrom.css'

const Login = () => {
    
    const history = useNavigate();

    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')

    async function submit(e){
        e.preventDefault()
        try {
            
            await axios.post("http://localhost:8080/",{
                email,password
        })
        .then(res=>{
            if(res.data=="exist"){
                history("/home",{state:{id:email}})
            }
            else if(res.data=="notexist"){
                alert("User not found")
            }
        })
        .catch(e=>{
            alert("Wrong data")
            console.log(e);
        })

        } catch (error) {
            console.log(error)
        }


    }

    

    return (
        <div className="login-form-container">
            <div className="banner">
                <h1>Disagro</h1>
            </div>
            <form onSubmit={submit} className="login-form">
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        required
                    />
                </div>
                <button type="submit">Login</button>

            </form>
        </div>


    )   
};

export default Login;