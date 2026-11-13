import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { loginPost } from "../api/memberApi"
import { getCookie, setCookie, removeCookie } from "../util/cookieUtil"

const saved = getCookie("member")
const initialState = { ...(saved?.email ? saved : { email: "" }), loading: false, error: "" }

export const loginPostAsync = createAsyncThunk("login/post", async (param, api) => {
  try {
    const data = await loginPost(param)
    if (!data.accessToken || !data.refreshToken) throw new Error("INVALID_RESPONSE")
    setCookie("member", data)
    return data
  } catch (error) {
    return api.rejectWithValue(error.response?.data?.error || "로그인에 실패했습니다. 서버와 입력값을 확인하세요.")
  }
})

const slice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    logout: () => {
      removeCookie("member")
      return { email: "", loading: false, error: "" }
    },
    tokensUpdated: (state, action) => ({ ...state, ...action.payload }),
  },
  extraReducers: (builder) => builder
    .addCase(loginPostAsync.pending, (state) => { state.loading = true; state.error = "" })
    .addCase(loginPostAsync.fulfilled, (state, action) => ({ ...action.payload, loading: false, error: "" }))
    .addCase(loginPostAsync.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    }),
})
export const { logout, tokensUpdated } = slice.actions
export default slice.reducer
