import axios from "axios"
import { API_SERVER_HOST } from "../api/server"
import { getCookie, setCookie, removeCookie } from "./cookieUtil"

const jwtAxios = axios.create()
let refreshPromise = null
let onMemberChange = () => {}
export const bindAuthState = (callback) => { onMemberChange = callback }

jwtAxios.interceptors.request.use((config) => {
  const member = getCookie("member")
  if (!member?.accessToken) return Promise.reject({ response: { status: 401, data: { error: "REQUIRE_LOGIN" } } })
  config.headers.Authorization = `Bearer ${member.accessToken}`
  return config
})

const refreshAndRetry = async (config) => {
  if (config._retried) throw new Error("TOKEN_RETRY_FAILED")
  config._retried = true
  try {
    if (!refreshPromise) {
      const member = getCookie("member")
      if (!member?.refreshToken) throw new Error("NO_REFRESH_TOKEN")
      refreshPromise = axios.post(`${API_SERVER_HOST}/api/member/refresh`,
        new URLSearchParams({ refreshToken: member.refreshToken }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      ).then(({ data }) => {
        if (!data.accessToken) throw new Error("INVALID_REFRESH_RESPONSE")
        const updated = { ...member, ...data }
        setCookie("member", updated)
        onMemberChange(updated)
        return data
      }).finally(() => { refreshPromise = null })
    }
    await refreshPromise
    return jwtAxios(config)
  } catch (error) {
    removeCookie("member")
    onMemberChange(null)
    throw Object.assign(new Error("ERROR_REFRESH_TOKEN"), { response: { status: 401, data: { error: "ERROR_REFRESH_TOKEN" } } })
  }
}

jwtAxios.interceptors.response.use(
  (response) => response.data?.error === "ERROR_ACCESS_TOKEN"
    ? refreshAndRetry(response.config) : response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.error === "ERROR_ACCESS_TOKEN") {
      return refreshAndRetry(error.config)
    }
    return Promise.reject(error)
  }
)
export default jwtAxios
