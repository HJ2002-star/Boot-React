import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getCartItems, postChangeCart, deleteCartItem } from "../api/cartApi"
import { logout, loginPostAsync } from "./loginSlice"
const initialState = { items: [], loading: false, error: "", requestId: null }
const request = async (operation, api) => {
  try { return await operation() }
  catch (error) { return api.rejectWithValue(error.response?.data?.message || "장바구니 요청에 실패했습니다.") }
}
export const getCartItemsAsync = createAsyncThunk("cart/get", (_, api) => request(getCartItems, api))
export const postChangeCartAsync = createAsyncThunk("cart/change", (item, api) => request(() => postChangeCart(item), api))
export const deleteCartItemAsync = createAsyncThunk("cart/delete", (cino, api) => request(() => deleteCartItem(cino), api))
const slice = createSlice({
  name: "cartSlice", initialState,
  reducers: { clearCart: () => ({ ...initialState, items: [] }) },
  extraReducers: (builder) => {
    builder.addCase(logout, () => ({ ...initialState, items: [] }))
      .addCase(loginPostAsync.fulfilled, () => ({ ...initialState, items: [] }))
    for (const thunk of [getCartItemsAsync, postChangeCartAsync, deleteCartItemAsync]) {
      builder.addCase(thunk.pending, (state, action) => {
        state.loading = true; state.error = ""; state.requestId = action.meta.requestId
      }).addCase(thunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.items = action.payload; state.loading = false; state.requestId = null
      }).addCase(thunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.error = action.payload || "장바구니 요청에 실패했습니다."
        state.loading = false; state.requestId = null
      })
    }
  },
})
export const { clearCart } = slice.actions
export default slice.reducer
