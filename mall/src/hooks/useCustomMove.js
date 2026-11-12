import { useNavigate, useSearchParams } from "react-router-dom"

const useCustomMove = () => {
  const navigate = useNavigate()
  const [queryParams] = useSearchParams()

  const page = Number(queryParams.get("page")) || 1
  const size = Number(queryParams.get("size")) || 10

  const moveToList = (pageParam = {}) => {
    const nextPage = pageParam.page || page
    const nextSize = pageParam.size || size

    navigate({
      pathname: "/todo/list",
      search: `?page=${nextPage}&size=${nextSize}`,
    })
  }

  const moveToRead = (tno) => {
    navigate(`/todo/read/${tno}?page=${page}&size=${size}`)
  }

  const moveToModify = (tno) => {
    navigate(`/todo/modify/${tno}?page=${page}&size=${size}`)
  }

  return { page, size, moveToList, moveToRead, moveToModify }
}

export default useCustomMove