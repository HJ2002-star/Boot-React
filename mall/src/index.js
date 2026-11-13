import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import "./index.css"
import App from "./App"
import store from "./store"
import { bindAuthState } from "./util/jwtUtil"
import { logout, tokensUpdated } from "./slices/loginSlice"
bindAuthState((member) => store.dispatch(member ? tokensUpdated(member) : logout()))

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}><App /></Provider>
)
