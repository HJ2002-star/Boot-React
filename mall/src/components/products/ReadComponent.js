import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getOne } from "../../api/productsApi"
import { API_SERVER_HOST } from "../../api/server"
import useCustomCart from "../../hooks/useCustomCart"
import useCustomLogin from "../../hooks/useCustomLogin"
const ReadComponent = ({ pno }) => {
  const [product, setProduct] = useState(null)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const { cartItems, changeCart, loading } = useCustomCart()
  const { loginState, isLogin, moveToLogin } = useCustomLogin()
  useEffect(() => {
    let active = true
    setProduct(null); setError(""); setMessage("")
    getOne(pno).then(data => { if (active) setProduct(data) })
      .catch(() => { if (active) setError("상품을 불러오지 못했습니다.") })
    return () => { active = false }
  }, [pno])
  const handleClickAddCart = async () => {
    if (!isLogin) { moveToLogin(); return }
    const added = cartItems.find(item => Number(item.pno) === Number(pno))
    if (added && !window.confirm("이미 추가된 상품입니다. 추가하시겠습니까?")) return
    setError(""); setMessage("")
    try {
      await changeCart({ email: loginState.email, pno: Number(pno), qty: (added?.qty || 0) + 1 })
      setMessage("장바구니에 추가했습니다.")
    } catch { setError("장바구니에 추가하지 못했습니다. 로그인과 서버 상태를 확인하세요.") }
  }
  return <div className="border-2 border-sky-200 mt-6 p-4">
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {message && <p role="status" className="text-green-700">{message}</p>}
    {!product && !error && <p>불러오는 중...</p>}
    {product && <>
      {[["PNO", product.pno], ["PNAME", product.pname], ["PRICE", product.price], ["PDESC", product.pdesc]].map(([title, value]) =>
        <div className="flex mb-3 border shadow-sm" key={title}><div className="w-1/4 p-3 font-bold">{title}</div><div className="w-3/4 p-3 break-words">{value}</div></div>)}
      <div className="flex flex-wrap justify-center">{product.uploadFileNames?.map(file => <img key={file} alt={product.pname} className="p-3 w-1/2 max-h-64 object-contain"
        src={`${API_SERVER_HOST}/api/products/view/s_${encodeURIComponent(file)}`} />)}</div>
      <div className="flex justify-end flex-wrap gap-2 p-4">
        <button type="button" disabled={loading} className="rounded p-4 text-xl text-white bg-green-500" onClick={handleClickAddCart}>Add Cart</button>
        <Link className="rounded p-4 text-xl text-white bg-blue-500" to="/products/list">List</Link>
      </div>
    </>}
  </div>
}
export default ReadComponent
