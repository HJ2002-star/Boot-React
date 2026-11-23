import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ProductEditor from "./ProductEditor"
import { postAdd, putOne, deleteOne } from "../../api/productsApi"
jest.mock("../../api/productsApi", () => ({ postAdd: jest.fn(), putOne: jest.fn(), deleteOne: jest.fn() }))
const product = { pno: 10, pname: "상품9", pdesc: "상품설명", price: 900, uploadFileNames: ["IMAGE1.jpg"] }
function mount(value) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  client.setQueryData(["products", "list", { page: 1, size: 10 }], { dtoList: [] })
  render(<QueryClientProvider client={client}><MemoryRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}><ProductEditor product={value} /></MemoryRouter></QueryClientProvider>)
  return client
}
beforeEach(() => jest.clearAllMocks())
test("상품 등록 Mutation이 FormData를 보내고 목록 캐시를 무효화한다", async () => {
  postAdd.mockResolvedValue({ result: 11 })
  const client = mount()
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "신상품" } })
  fireEvent.change(screen.getByLabelText("Price"), { target: { value: "1200" } })
  fireEvent.change(screen.getByLabelText("Description"), { target: { value: "설명" } })
  fireEvent.submit(screen.getByRole("button", { name: "Add" }).closest("form"))
  expect(await screen.findByText("등록 완료")).toBeInTheDocument()
  const form = postAdd.mock.calls[0][0]
  expect(form.get("pname")).toBe("신상품")
  expect(form.get("price")).toBe("1200")
  expect(client.getQueryState(["products", "list", { page: 1, size: 10 }]).isInvalidated).toBe(true)
})
test("상품 수정 Mutation이 기존 이미지 이름과 변경 값을 유지한다", async () => {
  putOne.mockResolvedValue({ RESULT: "SUCCESS" })
  mount(product)
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "수정상품" } })
  fireEvent.submit(screen.getByRole("button", { name: "Modify" }).closest("form"))
  expect(await screen.findByText("수정 완료")).toBeInTheDocument()
  expect(putOne.mock.calls[0][0]).toBe(10)
  expect(putOne.mock.calls[0][1].getAll("uploadFileNames")).toEqual(["IMAGE1.jpg"])
  expect(putOne.mock.calls[0][1].get("pname")).toBe("수정상품")
})
test("삭제 확인 뒤 Delete Mutation을 실행하고 성공 결과를 보여준다", async () => {
  deleteOne.mockResolvedValue({ RESULT: "SUCCESS" })
  const confirm = jest.spyOn(window, "confirm").mockReturnValue(true)
  mount(product)
  fireEvent.click(screen.getByRole("button", { name: "Delete" }))
  await waitFor(() => expect(deleteOne).toHaveBeenCalledWith(10))
  expect(await screen.findByText("삭제 완료")).toBeInTheDocument()
  confirm.mockRestore()
})
