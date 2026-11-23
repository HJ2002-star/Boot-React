import { Link } from "react-router-dom"
import { useRecoilValue } from "recoil"
import signinState from "../../atoms/signinState"

const BasicMenu = () => {
  const member = useRecoilValue(signinState)
  return <nav className="flex bg-blue-300">
    <div className="w-4/5 bg-gray-500"><ul className="flex flex-wrap p-4 text-white font-bold gap-6 text-2xl">
      <li><Link to="/">Main</Link></li><li><Link to="/about">About</Link></li>
      {member.email && <><li><Link to="/todo/">Todo</Link></li><li><Link to="/products/">Products</Link></li></>}
    </ul></div>
    <div className="w-1/5 flex flex-wrap justify-end items-center bg-orange-300 p-4 gap-2">
      {member.email ? <><span>{member.nickname}</span><Link to="/member/logout">Logout</Link></> : <Link to="/member/login">Login</Link>}
    </div>
  </nav>
}
export default BasicMenu
