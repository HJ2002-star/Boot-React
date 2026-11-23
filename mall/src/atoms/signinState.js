import { atom } from "recoil"
import { getCookie } from "../util/cookieUtil"
export const guestMember = { email: "", nickname: "", social: false, accessToken: "", refreshToken: "" }
const signinState = atom({
  key: "signinState", default: guestMember,
  effects: [({ setSelf, trigger }) => {
    if (trigger === "get") {
      const saved = getCookie("member")
      if (saved?.email) setSelf(saved)
    }
  }],
})
export default signinState
