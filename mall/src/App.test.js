import { snapshot_UNSTABLE } from "recoil"
import { cartState, cartTotalState } from "./atoms/cartState"
test("Recoil selector가 상품별 가격과 수량의 총액을 계산한다", () => {
  const snapshot = snapshot_UNSTABLE(({set}) => set(cartState, [{price: 900, qty: 2}, {price: 300, qty: 3}]))
  expect(snapshot.getLoadable(cartTotalState).valueOrThrow()).toBe(2700)
})
