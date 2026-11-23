import { useQuery } from "@tanstack/react-query"
import { getOne } from "../../api/productsApi"
import ProductEditor from "./ProductEditor"
const ModifyComponent = ({ pno }) => {
  const query = useQuery({ queryKey: ["products", "detail", Number(pno)], queryFn: () => getOne(pno) })
  if (query.isPending) return <p>불러오는 중...</p>
  if (query.isError) return <p role="alert">상품을 불러오지 못했습니다.</p>
  return <ProductEditor key={pno} product={query.data} />
}
export default ModifyComponent
