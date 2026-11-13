import useCustomLogin from "../../hooks/useCustomLogin"
const LogoutComponent = () => {
  const { doLogout, moveToPath } = useCustomLogin()
  return <div className="border-2 m-4 p-8 text-center"><h1 className="text-4xl text-red-500 mb-8">Logout Component</h1><button className="bg-red-500 text-white rounded p-4" onClick={() => { doLogout(); moveToPath("/") }}>LOGOUT</button></div>
}
export default LogoutComponent
