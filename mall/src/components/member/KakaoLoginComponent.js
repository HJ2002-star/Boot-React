import { useState } from "react"
import { getKakaoLoginLink } from "../../api/kakaoApi"

const KakaoLoginComponent = () => {
  const [error, setError] = useState("")
  const start = () => {
    try { window.location.assign(getKakaoLoginLink()) }
    catch (e) { setError(e.message) }
  }
  return <div className="mt-8 text-center">
    <p className="text-blue-500 mb-3">카카오 계정으로 로그인</p>
    <button type="button" className="bg-yellow-400 text-black font-bold rounded p-4 w-full" onClick={start}>KAKAO LOGIN</button>
    {error && <p role="alert" className="text-red-600 mt-3">{error}</p>}
  </div>
}
export default KakaoLoginComponent
