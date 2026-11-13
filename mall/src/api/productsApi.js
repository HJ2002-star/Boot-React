import jwtAxios from "../util/jwtUtil"
import { API_SERVER_HOST } from "./todoApi"

const host = `${API_SERVER_HOST}/api/products`

export const getList = async ({ page, size }) => {
  const res = await jwtAxios.get(`${host}/list`, {
    params: { page, size },
  })

  return res.data
}
