import { useParams } from "react-router-dom"
import ModifyComponent from "../../components/products/ModifyComponent"
const ModifyPage = () => { const { pno } = useParams(); return <div className="bg-white p-4"><h1 className="text-3xl font-bold">Products Modify Page</h1><ModifyComponent pno={pno} /></div> }
export default ModifyPage
