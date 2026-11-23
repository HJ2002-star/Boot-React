import { Suspense, lazy } from "react"
import { Navigate } from "react-router-dom"

const ProductsList = lazy(() => import("../pages/products/ListPage"))

const ProductRead = lazy(() => import("../pages/products/ReadPage"))

const ProductAdd = lazy(() => import("../pages/products/AddPage"))
const ProductModify = lazy(() => import("../pages/products/ModifyPage"))

const productsRouter = () => {
  return [
    { path: "add", element: <Suspense fallback={<div>Loading...</div>}><ProductAdd /></Suspense> },
    { path: "modify/:pno", element: <Suspense fallback={<div>Loading...</div>}><ProductModify /></Suspense> },
    { path: "read/:pno", element: <Suspense fallback={<div>Loading...</div>}><ProductRead /></Suspense> },
    {
      index: true,
      element: <Navigate replace to="list" />,
    },
    {
      path: "list",
      element: (
        <Suspense fallback={<div>Loading....</div>}>
          <ProductsList />
        </Suspense>
      ),
    },
  ]
}

export default productsRouter