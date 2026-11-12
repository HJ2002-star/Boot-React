import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"

const ReadPage = () => {
  const { tno } = useParams()
  const navigate = useNavigate()
  const [queryParams] = useSearchParams()

  const page = queryParams.get("page") || "1"
  const size = queryParams.get("size") || "10"
  const queryStr = createSearchParams({ page, size }).toString()

  const moveToModify = () => {
    navigate({
      pathname: `/todo/modify/${tno}`,
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
      Todo Read Page Component {tno}

      <div className="flex gap-4 mt-4">
        <button onClick={moveToModify}>Test Modify</button>
        <button onClick={moveToList}>Test List</button>
      </div>
    </div>
  )
}

export default ReadPage