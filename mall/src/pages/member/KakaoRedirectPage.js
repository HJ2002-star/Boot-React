import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import BasicMenu from "../../components/menus/BasicMenu"
import { exchangeKakaoCode } from "../../api/kakaoApi"
import { setCookie } from "../../util/cookieUtil"
import { tokensUpdated } from "../../slices/loginSlice"

const KakaoRedirectPage = () => {
  const [params] = useSearchParams()
  const code = params.get("code")
  const state = params.get("state")
  const error = params.get("error")
  const once = useRef(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [message, setMessage] = useState("카카오 로그인 처리 중...")
  useEffect(() => {
    if (once.current) return
    once.current = true
    if (error || !code) { setMessage("카카오 로그인 버튼에서 다시 시작하세요."); return }
    const expected = sessionStorage.getItem("kakaoOAuthState")
    if (!expected || state !== expected) { setMessage("인증 요청 상태가 일치하지 않습니다. 다시 로그인하세요."); return }
    window.history.replaceState(null, "", "/member/kakao")
    sessionStorage.removeItem("kakaoOAuthState")
    exchangeKakaoCode(code).then((member) => {
      if (!member.accessToken) throw new Error("토큰을 받지 못했습니다.")
      setCookie("member", member)
      dispatch(tokensUpdated({ ...member, loading: false, error: "" }))
      navigate(member.social ? "/member/modify" : "/products/list", { replace: true })
    }).catch((err) => setMessage(err.response?.data?.message || err.message || "소셜 로그인에 실패했습니다."))
  }, [code, state, error, dispatch, navigate])
  return <><BasicMenu /><main className="max-w-2xl mx-auto mt-12 p-8 border-2"><h1 className="text-3xl mb-6">Kakao Login Redirect</h1><p role="status">{message}</p><Link className="block underline mt-6" to="/member/login">로그인 화면으로</Link></main></>
}
export default KakaoRedirectPage
