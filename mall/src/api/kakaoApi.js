import axios from "axios"
import { API_SERVER_HOST } from "./server"
const clientId = process.env.REACT_APP_KAKAO_REST_API_KEY
export const getKakaoLoginLink = () => {
  if (!clientId) throw new Error("카카오 REST API 키 설정이 필요합니다.")
  const state = crypto.randomUUID()
  sessionStorage.setItem("kakaoOAuthState", state)
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: "http://localhost:3000/member/kakao",
    response_type: "code",
    state,
  })
  return `https://kauth.kakao.com/oauth/authorize?${params}`
}

export const exchangeKakaoCode = async (code) => {
  const res = await axios.post(`${API_SERVER_HOST}/api/member/kakao`, { code })
  return res.data
}
