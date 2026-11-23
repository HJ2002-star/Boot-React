import jwtAxios from "../util/jwtUtil"
import { API_SERVER_HOST } from "./server"
const host = `${API_SERVER_HOST}/api/cart`
export const getCartItems = async () => (await jwtAxios.get(`${host}/items`)).data
export const postChangeCart = async (item) => (await jwtAxios.post(`${host}/change`, item)).data
export const deleteCartItem = async (cino) => (await jwtAxios.delete(`${host}/${cino}`)).data
