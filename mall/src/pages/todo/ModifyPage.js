import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"

const ModifyPage = () => {
  const { tno } = useParams()
  const navigate = useNavigate()
  const [queryParams] = useSearchParams()
  const queryStr = queryParams.toString()

  const moveToRead = () => {
    navigate({
      pathname: `/todo/read/${tno}`,
      search: queryStr,
    })
  }

  const moveToList = () => {
    navigate({
      pathname: "/todo/list",
      search: queryStr,
    })
  }

  return (
    <div className="text-3xl font-extrabold">
      Todo Modify Page {tno}

      <div className="flex gap-4 mt-4">
        <button onClick={moveToRead}>Test Read</button>
        <button onClick={moveToList}>Test List</button>
      </div>
    </div>
  )
}

export default ModifyPage