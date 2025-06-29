import Admin from '../Page/Dashboard/Admin'
import Athour from '../Page/Dashboard/Author'
import User from '../Page/Dashboard/User'
import Home from '../Page/Home'
import PaymentSuccess from '../Page/Dashboard/PaymentSuccess'
import PaymentFaild from '../Page/Dashboard/PaymentFaild'
import EditPagePublic from '../Component/AuthorDashboard/EditPagePublic'
import ShowPost from '../Component/AuthorDashboard/ShowPost'
import ShowPostAdmin from '../Component/AdminDashboard/ShowPostAdmin'
import ShowPostPublic from '../Component/UserDashBoard/ShowPostPublic'
import ShowPostPrivate from '../Component/UserDashBoard/ShowPostPrivate'
import PublicProfile from '../Page/Dashboard/PublicProfile'


export const dashBoardRoute=[
{
path: '/home',
element:<Home/>,
children:[
{
    path: 'admindashboard',
    element: <Admin/>
},
{
    path:'athuordashboard',
    element:<Athour/>,

},
{
    path:'userdashboard',
    element:<User/>
},
{
    path: 'paymentsuccess',
    element: <PaymentSuccess/>
},
{
    path:'paymentfaild',
    element:<PaymentFaild/>
},
{
    path:'publicprofile/:id',
    element: <PublicProfile/>

},
{
        path:'athuordashboard/edit-post/:id',
    element:<EditPagePublic/>
},
{
    path:'athuordashboard/show-post/:id',
    element: <ShowPost/>
},
{
    path:'admindashboard/show-admin-post/:id',
    element: <ShowPostAdmin/>
},
{
    path:'userdashboard/show-public-post/:id',
    element: <ShowPostPublic/>
},
{
    path:'userdashboard/show-private-post/:id',
    element: <ShowPostPrivate/>

}
]
}]