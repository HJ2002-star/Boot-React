import { useEffect } from "react"
import { useSetRecoilState, useResetRecoilState } from "recoil"
import signinState, { guestMember } from "../../atoms/signinState"
import { cartState } from "../../atoms/cartState"
import { bindAuthState } from "../../util/jwtUtil"
import { queryClient } from "../../util/queryClient"
const AuthStateBridge = () => {
  const setMember = useSetRecoilState(signinState)
  const resetCart = useResetRecoilState(cartState)
  useEffect(() => {
    bindAuthState(member => {
      setMember(member || guestMember)
      if (!member) { resetCart(); queryClient.clear() }
    })
    return () => bindAuthState(() => {})
  }, [setMember, resetCart])
  return null
}
export default AuthStateBridge
