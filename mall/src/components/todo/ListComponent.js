import { useEffect, useState } from "react"
import { getList } from "../../api/todoApi"
import useCustomMove from "../../hooks/useCustomMove"

const ListComponent = () => {
  const { page, size, moveToRead } = useCustomMove()
  const [serverData, setServerData] = useState({ dtoList: [] })
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    setError("")

    getList({ page, size })
      .then((data) => {
        if (active) setServerData(data)
      })
      .catch(() => {
        if (active) {
          setError("목록을 불러오지 못했습니다. API 서버와 CORS 설정을 확인하세요.")
        }
      })

    return () => {
      active = false
    }
  }, [page, size])

  return (
    <div className="border-2 border-blue-100 mt-10 mx-2">
      {error && <p className="p-4 text-red-600">{error}</p>}

      <div className="flex flex-wrap mx-auto justify-center p-6">
        {serverData.dtoList.map((todo) => (
          <div
            key={todo.tno}
            className="w-full p-2 m-2 rounded shadow-md cursor-pointer"
            onClick={() => moveToRead(todo.tno)}
          >
            <div className="flex items-center">
              <div className="font-extrabold text-2xl p-2 w-1/12">
                {todo.tno}
              </div>

              <div className="m-1 p-2 w-8/12 font-extrabold">
                {todo.title}
              </div>

              <div className="m-1 p-2 font-medium">
                {todo.dueDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListComponent