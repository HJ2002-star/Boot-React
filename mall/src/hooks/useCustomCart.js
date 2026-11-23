import { useCallback, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRecoilState, useRecoilValue } from "recoil"
import signinState from "../atoms/signinState"
import { cartState } from "../atoms/cartState"
import { getCartItems, postChangeCart, deleteCartItem } from "../api/cartApi"
import { getCookie } from "../util/cookieUtil"
const useCustomCart = () => {
  const { email } = useRecoilValue(signinState)
  const [cartItems, setCartItems] = useRecoilState(cartState)
  const client = useQueryClient()
  const query = useQuery({ queryKey: ["cart", email], queryFn: getCartItems, enabled: Boolean(email), staleTime: 60000 })
  useEffect(() => {
    if (email && query.data) setCartItems(query.data)
  }, [email, query.data, setCartItems])
  const applyResult = result => {
    if (getCookie("member")?.email !== email) return
    setCartItems(result)
    client.setQueryData(["cart", email], result)
  }
  const change = useMutation({ mutationKey: ["cart", email, "change"], mutationFn: item => postChangeCart(item), onSuccess: applyResult })
  const remove = useMutation({ mutationKey: ["cart", email, "delete"], mutationFn: cino => deleteCartItem(cino), onSuccess: applyResult })
  const refreshCart = useCallback(() => client.invalidateQueries({ queryKey: ["cart", email] }), [client, email])
  return { cartItems: email ? cartItems : [], loading: query.isFetching || change.isPending || remove.isPending,
    error: (query.error || change.error || remove.error)?.message || "",
    refreshCart, changeCart: change.mutateAsync, removeCart: remove.mutateAsync }
}
export default useCustomCart
