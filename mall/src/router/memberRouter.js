import { Suspense, lazy } from "react"
const Login = lazy(() => import("../pages/member/LoginPage"))
const Logout = lazy(() => import("../pages/member/LogoutPage"))
const memberRouter = () => [
  { path: "login", element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense> },
  { path: "logout", element: <Suspense fallback={<div>Loading...</div>}><Logout /></Suspense> },
]
export default memberRouter
