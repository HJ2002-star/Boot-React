import { Suspense, lazy } from "react"
import { Navigate } from "react-router-dom"

const ProductsList = lazy(() => import("../pages/products/ListPage"))

const productsRouter = () => {
  return [
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