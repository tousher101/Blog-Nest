import StartUp from '../Page/Auth/StartUp'
import SignUp from '../Page/Auth/SignUp'
import SignIn from '../Page/Auth/SignIn'
import ForgetPass from '../Page/Auth/ForgetPass'

export const AuthRouter = [{
    path:'',
    element: <StartUp/>
},
{
    path: '/signup',
    element: <SignUp/>
},
{
    path:'/signin',
    element:<SignIn/>
},
{
    path:'/forgetpassword',
    element:<ForgetPass/>
}
]