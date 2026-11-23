import { useCallback, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useRecoilState, useResetRecoilState } from "recoil"
import signinState from "../atoms/signinState"
import { cartState } from "../atoms/cartState"
import { loginPost } from "../api/memberApi"
import { setCookie, removeCookie } from "../util/cookieUtil"
import { queryClient } from "../util/queryClient"
const useCustomLogin = () => {
  const navigate = useNavigate()
  const [loginState, setLoginState] = useRecoilState(signinState)
  const resetSignin = useResetRecoilState(signinState)
  const resetCart = useResetRecoilState(cartState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const saveAsCookie = useCallback(data => {
    if (!data?.accessToken || !data?.refreshToken) throw new Error("로그인 응답이 올바르지 않습니다.")
    queryClient.cancelQueries(); queryClient.clear(); resetCart()
    setCookie("member", data); setLoginState(data)
  }, [setLoginState, resetCart])
  const doLogin = async param => {
    setLoading(true); setError("")
    try { const data = await loginPost(param); saveAsCookie(data); return data }
    catch (err) { setError("이메일과 비밀번호 또는 서버 상태를 확인하세요."); throw err }
    finally { setLoading(false) }
  }
  const doLogout = useCallback(() => {
    removeCookie("member")
    resetSignin()
    resetCart()
    queryClient.cancelQueries()
    queryClient.clear()
  }, [resetSignin, resetCart])
  const moveToPath = path => navigate(path, { replace: true })
  const moveToLogin = () => navigate("/member/login", { replace: true })
  const moveToLoginReturn = () => <Navigate to="/member/login" replace />
  const exceptionHandle = useCallback(err => {
    if (err.response?.status === 401) {
      doLogout(); navigate("/member/login?error=REQUIRE_LOGIN", { replace: true })
    } else if (err.response?.status === 403) window.alert("해당 메뉴에 접근할 권한이 없습니다.")
    else window.alert("서버 요청에 실패했습니다. API 서버를 확인하세요.")
  }, [doLogout, navigate])
  return { loginState: { ...loginState, loading, error }, isLogin: Boolean(loginState.email), doLogin, doLogout, saveAsCookie, moveToPath, moveToLogin, moveToLoginReturn, exceptionHandle }
}
export default useCustomLogin
