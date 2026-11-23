import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import ReadComponent from "./ReadComponent"
import { getOne } from "../../api/productsApi"
import useCustomCart from "../../hooks/useCustomCart"
jest.mock("../../api/productsApi", () => ({ getOne: jest.fn() }))
jest.mock("../../hooks/useCustomCart", () => jest.fn())
jest.mock("../../hooks/useCustomLogin", () => () => ({ isLogin: true, loginState: { email: "user1@aaa.com" } }))
const product = { pno: 10, pname: "상품9", price: 900, pdesc: "상품설명", uploadFileNames: [] }
test("상품 상세에서 Add Cart를 누르면 로그인 회원과 상품 번호를 보내고 성공 메시지를 표시한다", async () => {
  getOne.mockResolvedValue(product)
  const changeCart = jest.fn().mockResolvedValue([])
  useCustomCart.mockReturnValue({ cartItems: [], loading: false, changeCart })
  render(<MemoryRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}><ReadComponent pno="10" /></MemoryRouter>)
  fireEvent.click(await screen.findByRole("button", { name: "Add Cart" }))
  await waitFor(() => expect(changeCart).toHaveBeenCalledWith({ email: "user1@aaa.com", pno: 10, qty: 1 }))
  expect(await screen.findByText("장바구니에 추가했습니다.")).toBeInTheDocument()
})

test("이미 담긴 상품은 확인 후 기존 수량에 1을 더해 전송한다", async () => {
  getOne.mockResolvedValue(product)
  const changeCart = jest.fn().mockResolvedValue([])
  useCustomCart.mockReturnValue({ cartItems: [{ pno: 10, qty: 2 }], loading: false, changeCart })
  const confirm = jest.spyOn(window, "confirm").mockReturnValue(true)
  render(<MemoryRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}><ReadComponent pno="10" /></MemoryRouter>)
  fireEvent.click(await screen.findByRole("button", { name: "Add Cart" }))
  await waitFor(() => expect(changeCart).toHaveBeenCalledWith({ email: "user1@aaa.com", pno: 10, qty: 3 }))
  confirm.mockRestore()
})
