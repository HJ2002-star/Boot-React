import React from "react"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { RecoilRoot, useRecoilValue } from "recoil"
import { QueryClientProvider } from "@tanstack/react-query"
import CartComponent from "./CartComponent"
import signinState from "../../atoms/signinState"
import { cartState } from "../../atoms/cartState"
import { queryClient } from "../../util/queryClient"
import { setCookie, removeCookie, getCookie } from "../../util/cookieUtil"
import useCustomLogin from "../../hooks/useCustomLogin"
import { getCartItems, postChangeCart, deleteCartItem } from "../../api/cartApi"
jest.mock("../../api/cartApi", () => ({ getCartItems: jest.fn(), postChangeCart: jest.fn(), deleteCartItem: jest.fn() }))
const member = { email: "user1@aaa.com", nickname: "USER1", accessToken: "test-access", refreshToken: "test-refresh" }
const item = { cino: 7, pno: 10, pname: "상품9", price: 900, qty: 2, imageFile: "IMAGE1.jpg" }
function LogoutProbe() {
  const { doLogout } = useCustomLogin()
  const signin = useRecoilValue(signinState)
  const cart = useRecoilValue(cartState)
  return <><button onClick={doLogout}>TEST LOGOUT</button><output data-testid="auth">{signin.email || "guest"}</output><output data-testid="items">{cart.length}</output></>
}
const mount = () => render(<RecoilRoot><QueryClientProvider client={queryClient}><MemoryRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}><CartComponent /><LogoutProbe /></MemoryRouter></QueryClientProvider></RecoilRoot>)
beforeEach(() => { queryClient.clear(); setCookie("member", member); jest.clearAllMocks() })
afterEach(() => { queryClient.clear(); removeCookie("member") })
test("Recoil 장바구니에 Query 조회·수량 변경·삭제와 합계를 반영한다", async () => {
  getCartItems.mockResolvedValue([item])
  postChangeCart.mockResolvedValue([{ ...item, qty: 3 }])
  deleteCartItem.mockResolvedValue([])
  mount()
  expect(await screen.findByText("Qty: 2")).toBeInTheDocument()
  expect(screen.getByText("TOTAL: 1,800 원")).toBeInTheDocument()
  fireEvent.click(screen.getByRole("button", { name: "상품9 수량 증가" }))
  expect(await screen.findByText("Qty: 3")).toBeInTheDocument()
  expect(postChangeCart).toHaveBeenCalledWith({ email: member.email, cino: 7, pno: 10, qty: 3 })
  expect(screen.getByText("TOTAL: 2,700 원")).toBeInTheDocument()
  fireEvent.click(screen.getByRole("button", { name: "상품9 삭제" }))
  expect(await screen.findByText("장바구니가 비어 있습니다.")).toBeInTheDocument()
  expect(deleteCartItem).toHaveBeenCalledWith(7)
  expect(screen.getByText("TOTAL: 0 원")).toBeInTheDocument()
})
test("로그아웃 시 쿠키·로그인 Atom·장바구니 Atom·Query 캐시를 지운다", async () => {
  getCartItems.mockResolvedValue([item])
  mount()
  await screen.findByText("Qty: 2")
  queryClient.setQueryData(["products", "detail", 10], { pno: 10 })
  fireEvent.click(screen.getByText("TEST LOGOUT"))
  await waitFor(() => expect(screen.getByTestId("auth")).toHaveTextContent("guest"))
  expect(screen.getByTestId("items")).toHaveTextContent("0")
  expect(getCookie("member")).toBeUndefined()
  expect(queryClient.getQueryData(["products", "detail", 10])).toBeUndefined()
  expect(screen.queryByText("Qty: 2")).not.toBeInTheDocument()
})
test("로그아웃 뒤 도착한 변경 응답이 이전 회원 장바구니를 복원하지 않는다", async () => {
  getCartItems.mockResolvedValue([item])
  let finish
  postChangeCart.mockImplementation(() => new Promise(resolve => { finish = resolve }))
  mount()
  await screen.findByText("Qty: 2")
  fireEvent.click(screen.getByRole("button", { name: "상품9 수량 증가" }))
  await waitFor(() => expect(finish).toBeDefined())
  fireEvent.click(screen.getByText("TEST LOGOUT"))
  await act(async () => { finish([{ ...item, qty: 3 }]) })
  expect(screen.getByTestId("auth")).toHaveTextContent("guest")
  expect(screen.getByTestId("items")).toHaveTextContent("0")
  expect(queryClient.getQueryData(["cart", member.email])).toBeUndefined()
})
