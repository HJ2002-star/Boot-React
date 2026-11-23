import { Outlet, useNavigate } from "react-router-dom"
import BasicLayout from "../../layouts/BasicLayout"

const IndexPage = () => {
  const navigate = useNavigate()

  return (
    <BasicLayout>
      <div className="font-extrabold">Products Menus</div>

      <div className="flex m-2 p-2">
        <button
          className="text-xl m-1 p-2 w-20 font-extrabold underline"
          onClick={() => navigate("/products/list")}
        >
          LIST
        </button>
        <button className="text-xl m-1 p-2 w-20 font-extrabold underline" onClick={() => navigate("/products/add")}>ADD</button>
      </div>

      <Outlet />
    </BasicLayout>
  )
}

export default IndexPage