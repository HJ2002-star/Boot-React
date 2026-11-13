import { Cookies } from "react-cookie"
const cookies = new Cookies()
export const setCookie = (name, value, days = 1) => {
  cookies.set(name, value, { path: "/", maxAge: days * 86400, sameSite: "lax" })
}
export const getCookie = (name) => cookies.get(name)
export const removeCookie = (name) => cookies.remove(name, { path: "/" })
