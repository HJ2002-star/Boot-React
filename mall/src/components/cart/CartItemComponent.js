import { API_SERVER_HOST } from "../../api/server"
const CartItemComponent = ({ cino, pname, price, pno, qty, imageFile, changeCart, removeCart, email, loading }) => {
  const changeQty = amount => changeCart({ email, cino, pno, qty: qty + amount }).catch(() => {})
  return <li className="border-2 bg-white my-2 p-3 rounded">
    {imageFile && <img className="w-full max-h-40 object-contain" alt={pname}
      src={`${API_SERVER_HOST}/api/products/view/s_${encodeURIComponent(imageFile)}`} />}
    <div>Cart Item No: {cino}</div><div>Pno: {pno}</div><div>Name: {pname}</div><div>Price: {price}</div>
    <div className="flex items-center flex-wrap gap-2 my-2"><span>Qty: {qty}</span>
      <button type="button" disabled={loading} aria-label={`${pname} 수량 증가`} className="bg-orange-500 rounded px-3 py-1" onClick={() => changeQty(1)}>+</button>
      <button type="button" disabled={loading} aria-label={`${pname} 수량 감소`} className="bg-orange-500 rounded px-3 py-1" onClick={() => changeQty(-1)}>−</button>
      <button type="button" disabled={loading} aria-label={`${pname} 삭제`} className="bg-red-500 text-white rounded px-3 py-1" onClick={() => removeCart(cino).catch(() => {})}>X</button>
    </div><div className="font-bold text-right border-t pt-2">{(qty * price).toLocaleString()} 원</div>
  </li>
}
export default CartItemComponent
