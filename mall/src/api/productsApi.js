import axios from "axios"
import { API_SERVER_HOST } from "./todoApi"

const host = `${API_SERVER_HOST}/api/products`

export const getList = async ({ page, size }) => {
  const res = await axios.get(`${host}/list`, {
    params: { page, size },
  })

  return res.data
}