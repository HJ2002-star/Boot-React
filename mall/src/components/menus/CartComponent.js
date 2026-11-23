import { useRecoilValue } from "recoil"
import { cartTotalState } from "../../atoms/cartState"
import useCustomLogin from "../../hooks/useCustomLogin"
import useCustomCart from "../../hooks/useCustomCart"
import CartItemComponent from "../cart/CartItemComponent"
const CartComponent = () => {
  const { isLogin, loginState } = useCustomLogin()
  const { cartItems, loading, error, refreshCart, changeCart, removeCart } = useCustomCart()
  const total = useRecoilValue(cartTotalState)
  if (!isLogin) return <p>로그인하면 장바구니를 이용할 수 있습니다.</p>
  return <div className="w-full min-w-0" aria-label="장바구니">
    <div className="flex items-center justify-between gap-2"><h2 className="font-bold text-2xl break-all">{loginState.nickname}'s Cart</h2><span className="bg-orange-600 rounded-full px-3 text-white">{cartItems.length}</span></div>
    {loading && <p role="status">장바구니 처리 중...</p>}
    {error && <div role="alert" className="text-red-700 my-2">{error}<button className="underline ml-2" onClick={refreshCart}>다시 시도</button></div>}
    {!loading && cartItems.length === 0 && <p className="py-4">장바구니가 비어 있습니다.</p>}
    <ul>{cartItems.map(item => <CartItemComponent key={item.cino} {...item} email={loginState.email} loading={loading} changeCart={changeCart} removeCart={removeCart} />)}</ul>
    <div className="text-2xl font-bold text-right mt-4">TOTAL: {total.toLocaleString()} 원</div>
  </div>
}
export default CartComponent
