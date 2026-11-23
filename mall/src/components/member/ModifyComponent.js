import { useState } from "react"
import { useRecoilValue } from "recoil"
import signinState from "../../atoms/signinState"
import { modifyMember } from "../../api/memberApi"
import useCustomLogin from "../../hooks/useCustomLogin"
import ResultModal from "../common/ResultModal"

const ModifyComponent = () => {
  const info = useRecoilValue(signinState)
  const [member, setMember] = useState({ email: info.email || "", pw: "", nickname: info.nickname || "" })
  const [result, setResult] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const { doLogout, moveToLogin } = useCustomLogin()
  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError("")
    try { await modifyMember(member); setResult(true) }
    catch (err) { setError(err.response?.data?.message || "회원정보 수정에 실패했습니다.") }
    finally { setBusy(false) }
  }
  const closeModal = () => { setResult(false); doLogout(); moveToLogin() }
  return <div className="mt-6">
    {result && <ResultModal title="회원정보" content="정보수정완료. 확인 후 변경한 정보로 다시 로그인하세요." callbackFn={closeModal} />}
    <form onSubmit={submit} className="p-6">
      <label className="flex gap-4 items-center mb-4"><span className="w-1/5">Email</span><input className="border p-4 flex-1" value={member.email} readOnly /></label>
      <label className="flex gap-4 items-center mb-4"><span className="w-1/5">Password</span><input className="border p-4 flex-1" type="password" autoComplete="new-password" minLength={8} maxLength={64} required value={member.pw} onChange={(e) => setMember({ ...member, pw: e.target.value })} /></label>
      <label className="flex gap-4 items-center mb-4"><span className="w-1/5">Nickname</span><input className="border p-4 flex-1" required maxLength={30} value={member.nickname} onChange={(e) => setMember({ ...member, nickname: e.target.value })} /></label>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <div className="text-right"><button disabled={busy} className="bg-blue-500 text-white rounded p-4">{busy ? "처리 중..." : "Modify"}</button></div>
    </form>
  </div>
}
export default ModifyComponent
