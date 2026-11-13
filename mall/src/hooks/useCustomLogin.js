import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { loginPostAsync, logout } from "../slices/loginSlice"

const useCustomLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loginState = useSelector((state) => state.loginSlice)
  const doLogin = (param) => dispatch(loginPostAsync(param)).unwrap()
  const doLogout = () => dispatch(logout())
  const moveToPath = (path) => navigate(path, { replace: true })
  const moveToLogin = () => navigate("/member/login", { replace: true })
  const moveToLoginReturn = () => <Navigate to="/member/login" replace />
  const exceptionHandle = (error) => {
    const code = error.response?.data?.error
    if (error.response?.status === 401 || code === "REQUIRE_LOGIN" || code === "ERROR_REFRESH_TOKEN") {
      dispatch(logout())
      navigate("/member/login?error=REQUIRE_LOGIN", { replace: true })
    } else if (error.response?.status === 403) {
      window.alert("해당 메뉴에 접근할 권한이 없습니다.")
    } else {
      window.alert("서버 요청에 실패했습니다. API 서버를 확인하세요.")
    }
  }
  return { loginState, isLogin: Boolean(loginState.email), doLogin, doLogout, moveToPath, moveToLogin, moveToLoginReturn, exceptionHandle }
}
export default useCustomLogin
