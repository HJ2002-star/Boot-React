import { Suspense, lazy } from "react"
import { Navigate } from "react-router-dom"

const ProductsList = lazy(() => import("../pages/products/ListPage"))

const ProductRead = lazy(() => import("../pages/products/ReadPage"))

const productsRouter = () => {
  return [
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