import { createBrowserRouter } from "react-router-dom";
import { AuthRouter} from'./Route/Auth'
import { dashBoardRoute } from "./Route/Dashboard";
import App from './App'


const mainRoutes=[{
    path:'/',
    element: <App/>,

children:[
    ...AuthRouter,
    ...dashBoardRoute,
]
}];
export const route=createBrowserRouter(mainRoutes)