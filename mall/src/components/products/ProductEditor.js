import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postAdd, putOne, deleteOne } from "../../api/productsApi"
import ResultModal from "../common/ResultModal"
const ProductEditor = ({ product }) => {
  const edit = Boolean(product?.pno)
  const [draft, setDraft] = useState(product || { pname: "", pdesc: "", price: 0 })
  const [files, setFiles] = useState([])
  const [images, setImages] = useState(product?.uploadFileNames || [])
  const [result, setResult] = useState("")
  const navigate = useNavigate()
  const client = useQueryClient()
  const invalidate = async () => {
    await client.invalidateQueries({ queryKey: ["products"] })
    await client.invalidateQueries({ queryKey: ["cart"] })
  }
  const save = useMutation({ mutationFn: form => edit ? putOne(product.pno, form) : postAdd(form),
    onSuccess: async () => { await invalidate(); setResult(edit ? "수정 완료" : "등록 완료") } })
  const remove = useMutation({ mutationFn: () => deleteOne(product.pno),
    onSuccess: async () => { await invalidate(); setResult("삭제 완료") } })
  const submit = event => {
    event.preventDefault()
    const form = new FormData()
    for (const key of ["pname", "pdesc", "price"]) form.append(key, draft[key])
    files.forEach(file => form.append("files", file))
    if (edit) images.forEach(file => form.append("uploadFileNames", file))
    save.mutate(form)
  }
  const busy = save.isPending || remove.isPending
  return <div className="border p-5 mt-4">
    {result && <ResultModal title="상품 처리" content={result} callbackFn={() => navigate("/products/list")} />}
    {(save.isError || remove.isError) && <p role="alert" className="text-red-600">상품 처리에 실패했습니다. 입력값과 서버를 확인하세요.</p>}
    <form onSubmit={submit} className="space-y-4">
      <label className="block">Name<input required className="border p-3 w-full" value={draft.pname} onChange={e => setDraft({ ...draft, pname: e.target.value })} /></label>
      <label className="block">Price<input required type="number" min="0" step="1" className="border p-3 w-full" value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} /></label>
      <label className="block">Description<textarea required className="border p-3 w-full" value={draft.pdesc} onChange={e => setDraft({ ...draft, pdesc: e.target.value })} /></label>
      <label className="block">Images<input type="file" accept="image/*" multiple className="block" onChange={e => setFiles(Array.from(e.target.files || []))} /></label>
      {images.map(file => <label key={file} className="block break-all"><input type="checkbox" checked onChange={() => setImages(images.filter(name => name !== file))} /> {file} 유지</label>)}
      <button disabled={busy} className="bg-blue-500 text-white rounded p-3" type="submit">{busy ? "처리 중..." : edit ? "Modify" : "Add"}</button>
      {edit && <button disabled={busy} className="bg-red-500 text-white rounded p-3 ml-3" type="button" onClick={() => { if (window.confirm("이 상품을 삭제하시겠습니까?")) remove.mutate() }}>Delete</button>}
    </form>
  </div>
}
export default ProductEditor
