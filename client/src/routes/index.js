import * as React from "react";
import {
  createBrowserRouter,
} from "react-router-dom";
import Register from "../pages/Register";
import CheckEmail from './../pages/CheckEmail';
import CheckPassword from "../pages/CheckPassword";
import Home from "../pages/Home";
import Message from "../components/Message";
import App from './../App';
import AuthLayouts from "../layouts";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
            {
                path:"register",
                element: <Register/>
            },{
                path:"email",
                element:<CheckEmail/>
            },{
                path:'password',
                element:<CheckPassword/>
            },{
                path:"",
                element:<AuthLayouts><Home/></AuthLayouts>,
                children: [
                    {
                        path:':userId',
                        element: <Message/>
                    }
                ]
            }
        ]
    }
])

export default router
