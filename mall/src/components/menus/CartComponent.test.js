import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import CartComponent from "./CartComponent"
import cartReducer, { getCartItemsAsync } from "../../slices/cartSlice"
import { logout } from "../../slices/loginSlice"
import { getCartItems, postChangeCart, deleteCartItem } from "../../api/cartApi"

jest.mock("../../hooks/useCustomLogin", () => () => ({ isLogin: true, loginState: { email: "user1@aaa.com", nickname: "USER1" } }))
jest.mock("../../api/cartApi", () => ({ getCartItems: jest.fn(), postChangeCart: jest.fn(), deleteCartItem: jest.fn() }))
const item = { cino: 7, pno: 10, pname: "상품9", price: 900, qty: 2, imageFile: "IMAGE1.jpg" }

test("장바구니 조회, 수량 변경, 합계 계산, 삭제 결과를 화면에 반영한다", async () => {
  getCartItems.mockResolvedValue([item])
  postChangeCart.mockResolvedValue([{ ...item, qty: 3 }])
  deleteCartItem.mockResolvedValue([])
  const store = configureStore({ reducer: { cartSlice: cartReducer } })
  render(<Provider store={store}><CartComponent /></Provider>)
  expect(await screen.findByText("Qty: 2")).toBeInTheDocument()
  expect(screen.getByText("TOTAL: 1,800 원")).toBeInTheDocument()
  fireEvent.click(screen.getByRole("button", { name: "상품9 수량 증가" }))
  expect(await screen.findByText("Qty: 3")).toBeInTheDocument()
  expect(postChangeCart).toHaveBeenCalledWith({ email: "user1@aaa.com", cino: 7, pno: 10, qty: 3 })
  expect(screen.getByText("TOTAL: 2,700 원")).toBeInTheDocument()
  fireEvent.click(screen.getByRole("button", { name: "상품9 삭제" }))
  await waitFor(() => expect(screen.getByText("장바구니가 비어 있습니다.")).toBeInTheDocument())
  expect(deleteCartItem).toHaveBeenCalledWith(7)
  expect(screen.getByText("TOTAL: 0 원")).toBeInTheDocument()
})

test("로그아웃 뒤 늦게 도착한 장바구니 응답으로 이전 회원 항목을 복원하지 않는다", () => {
  let state = cartReducer(undefined, getCartItemsAsync.pending("old-request"))
  state = cartReducer(state, logout())
  state = cartReducer(state, getCartItemsAsync.fulfilled([item], "old-request"))
  expect(state.items).toEqual([])
  expect(state.loading).toBe(false)
})
