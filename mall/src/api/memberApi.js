import axios from "axios"
import { API_SERVER_HOST } from "./server"
export const loginPost = async ({ email, pw }) => {
  const form = new URLSearchParams({ username: email, password: pw })
  const res = await axios.post(`${API_SERVER_HOST}/api/member/login`, form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
  return res.data
}
