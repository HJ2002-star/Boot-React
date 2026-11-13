import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import BasicLayout from "../../layouts/BasicLayout"
import ModifyComponent from "../../components/member/ModifyComponent"
const ModifyPage = () => {
  const email = useSelector((state) => state.loginSlice.email)
  if (!email) return <Navigate to="/member/login" replace />
  return <BasicLayout><h1 className="text-3xl">Member Modify Page</h1><div className="bg-white mt-4 p-2"><ModifyComponent /></div></BasicLayout>
}
export default ModifyPage
