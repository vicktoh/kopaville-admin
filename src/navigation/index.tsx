import React, {FC} from 'react';
import { Routes, BrowserRouter, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { HistoryVille } from '../pages/HistoryVille';
import { Layout } from '../pages/Layout';
import { MarketPlace } from '../pages/MarketPlace';
import { MarketPlaceLayout } from '../pages/MarketPlaceLayout';
import { Users } from '../pages/Users';




const MainRoutes : FC = ()=> {
   
   return (
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
                <Route index element = {<Navigate to= "/dashboard"/>} />
                <Route  path="dashboard">
                    <Route element = {<Dashboard/>} index />
                </Route>
                <Route path="users" element= {<Users/>}></Route>
                <Route  path="/market" element = {<MarketPlaceLayout/>}>
                  <Route index element={<MarketPlace />} />
                  <Route path = "categories" element={<MarketPlace/>}  />
                  <Route path = "vendors" element={<MarketPlace/>}  />
                </Route>
                <Route path="historyville" element={<HistoryVille />} />
            </Route>
        </Routes>
      </BrowserRouter>
   )
}

export default MainRoutes