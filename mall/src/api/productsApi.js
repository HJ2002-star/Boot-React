import jwtAxios from "../util/jwtUtil"
import { API_SERVER_HOST } from "./todoApi"

const host = `${API_SERVER_HOST}/api/products`

export const getList = async ({ page, size }) => {
  const res = await jwtAxios.get(`${host}/list`, {
    params: { page, size },
  })

  return res.data
}

export const getOne = async (pno) => (await jwtAxios.get(`${host}/${pno}`)).data

export const postAdd = async form => (await jwtAxios.post(`${host}/`, form)).data
export const putOne = async (pno, form) => (await jwtAxios.put(`${host}/${pno}`, form)).data
export const deleteOne = async pno => (await jwtAxios.delete(`${host}/${pno}`)).data
