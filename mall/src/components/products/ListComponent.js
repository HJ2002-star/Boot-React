import { useQuery } from "@tanstack/react-query"
import { Link, useSearchParams } from "react-router-dom"
import { getList } from "../../api/productsApi"
import { API_SERVER_HOST } from "../../api/todoApi"

const ListComponent = () => {
  const [queryParams] = useSearchParams()

  const page = Number(queryParams.get("page")) || 1
  const size = Number(queryParams.get("size")) || 10

  const query = useQuery({ queryKey: ["products", "list", { page, size }], queryFn: () => getList({ page, size }) })
  const serverData = query.data || { dtoList: [] }
  const fetching = query.isFetching
  const error = query.isError ? "상품 목록을 불러오지 못했습니다." : ""
return (
    <div className="border-2 border-blue-100 mt-10 mx-2">
      {fetching && <p className="p-4">불러오는 중...</p>}
      {error && <p className="p-4 text-red-600">{error}</p>}

      <div className="flex flex-wrap p-6">
        {serverData.dtoList.map((product) => (
          <div
            key={product.pno}
            className="w-1/2 p-1 rounded shadow-md border-2"
          >
            <Link to={`/products/read/${product.pno}?page=${page}&size=${size}`} className="flex flex-col h-full" aria-label={`${product.pname} 상세 보기`}>
              <div className="font-extrabold text-2xl p-2">
                {product.pno}
              </div>

              <div className="m-1 p-2">
                <div className="w-full overflow-hidden">
                  {product.uploadFileNames?.[0] && (
                    <img
                      alt={product.pname}
                      className="m-auto rounded-md w-60"
                      src={`${API_SERVER_HOST}/api/products/view/s_${encodeURIComponent(product.uploadFileNames[0])}`}
                    />
                  )}
                </div>

                <div className="font-extrabold bg-white">
                  <div className="text-center p-1">
                    이름: {product.pname}
                  </div>
                  <div className="text-center p-1">
                    가격: {product.price}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )



}

export default ListComponent
