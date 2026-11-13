import { useState } from "react"
import useCustomLogin from "../../hooks/useCustomLogin"

const LoginComponent = () => {
  const [param, setParam] = useState({ email: "", pw: "" })
  const { doLogin, moveToPath, loginState } = useCustomLogin()
  const submit = async (event) => {
    event.preventDefault()
    try { await doLogin(param); moveToPath("/products/list?page=1&size=10") } catch (_) { }
  }
  return (
    <form onSubmit={submit} className="border-2 border-sky-200 m-4 p-8 w-full max-w-2xl">
      <h1 className="text-4xl font-extrabold text-blue-500 text-center mb-8">Login Component</h1>
      <label className="flex items-center gap-4 mb-4">Email
        <input name="email" type="email" autoComplete="username" required className="border p-4 flex-1" value={param.email} onChange={(e) => setParam({ ...param, email: e.target.value })} />
      </label>
      <label className="flex items-center gap-4 mb-4">Password
        <input name="pw" type="password" autoComplete="current-password" required className="border p-4 flex-1" value={param.pw} onChange={(e) => setParam({ ...param, pw: e.target.value })} />
      </label>
      {loginState.error && <p role="alert" className="text-red-600">{loginState.error}</p>}
      <button disabled={loginState.loading} className="block mx-auto mt-6 rounded p-4 w-36 bg-blue-500 text-white">{loginState.loading ? "로그인 중..." : "LOGIN"}</button>
    </form>
  )
}
export default LoginComponent
