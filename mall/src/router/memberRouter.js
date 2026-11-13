import { Suspense, lazy } from "react"
const Login = lazy(() => import("../pages/member/LoginPage"))
const Logout = lazy(() => import("../pages/member/LogoutPage"))
const KakaoRedirect = lazy(() => import("../pages/member/KakaoRedirectPage"))
const MemberModify = lazy(() => import("../pages/member/ModifyPage"))
const memberRouter = () => [
  { path: "modify", element: <Suspense fallback={<div>Loading...</div>}><MemberModify /></Suspense> },
  { path: "kakao", element: <Suspense fallback={<div>Loading...</div>}><KakaoRedirect /></Suspense> },
  { path: "login", element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense> },
  { path: "logout", element: <Suspense fallback={<div>Loading...</div>}><Logout /></Suspense> },
]
export default memberRouter
