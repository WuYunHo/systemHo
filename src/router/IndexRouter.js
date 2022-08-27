import React from 'react'
import {HashRouter, Navigate, Route, Routes,} from 'react-router-dom'
import Login from '../views/login/Login'
import Detail from '../views/news/Detail'
import News from '../views/news/News'
import NewsSandBox from '../views/sandbox/NewsSandBox'

export default function IndexRouter() {
  return (
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/news" element={<News/>}/>
            <Route path="/detail/:id" element={<Detail/>}/>
            {/* <Route path="/" component={NewsSandBox}/>*/}
            <Route path="/*" element={localStorage.getItem("token") ?  <NewsSandBox/> : <Navigate to="/login"/>} />
  
          </Routes>
        </HashRouter>         
  )
}
