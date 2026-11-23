import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCartItemsAsync, postChangeCartAsync, deleteCartItemAsync, clearCart } from "../slices/cartSlice"
const useCustomCart = () => {
  const dispatch = useDispatch()
  const { items: cartItems, loading, error } = useSelector(state => state.cartSlice)
  const refreshCart = useCallback(() => dispatch(getCartItemsAsync()), [dispatch])
  const changeCart = useCallback(item => dispatch(postChangeCartAsync(item)).unwrap(), [dispatch])
  const removeCart = useCallback(cino => dispatch(deleteCartItemAsync(cino)).unwrap(), [dispatch])
  const resetCart = useCallback(() => dispatch(clearCart()), [dispatch])
  return { cartItems, loading, error, refreshCart, changeCart, removeCart, resetCart }
}
export default useCustomCart
