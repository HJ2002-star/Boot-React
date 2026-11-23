import { RouterProvider } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import root from "./router/root"
import { queryClient } from "./util/queryClient"
import AuthStateBridge from "./components/member/AuthStateBridge"
function App() {
  return <QueryClientProvider client={queryClient}>
    <AuthStateBridge />
    <RouterProvider router={root} />
    {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
}
export default App
