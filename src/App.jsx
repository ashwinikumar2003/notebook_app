import React from 'react'
import Login from '../components/login/login.jsx'
import Register from '../components/register/reg.jsx'
import Navbar from '../components/navbar/Navbar.jsx'
import Home from '../components/home.jsx'
import About from '../components/about.jsx'
import './App.css'
import {Route, Routes} from 'react-router-dom'
function App(){
    
    return (
        <>
        <Navbar></Navbar>
        <Routes>
            <Route exact path='/' element={<Login/>}></Route>
            <Route exact path='/about' element={<About/>}></Route>
            <Route exact path='/register' element={<Register/>}></Route>
            <Route exact path='/home' element={<Home/>}></Route>
            <Route path='*' element={<Login/>}></Route>
        </Routes>
        </>
    )
}

export default App