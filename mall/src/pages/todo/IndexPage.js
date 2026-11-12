import { Outlet, useNavigate } from "react-router-dom"
import BasicLayout from "../../layouts/BasicLayout"

const IndexPage = () => {
  const navigate = useNavigate()

  return (
    <BasicLayout>
      <div className="w-full flex m-2 p-2">
        <button
          className="text-xl m-1 p-2 w-20 font-extrabold text-center underline"
          onClick={() => navigate("/todo/list")}
        >
          LIST
        </button>

        <button
          className="text-xl m-1 p-2 w-20 font-extrabold text-center underline"
          onClick={() => navigate("/todo/add")}
        >
          ADD
        </button>
      </div>

      <div className="flex flex-wrap w-full">
        <Outlet />
      </div>
    </BasicLayout>
  )
}

export default IndexPage