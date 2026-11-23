import { useParams } from "react-router-dom"
import ReadComponent from "../../components/products/ReadComponent"
const ReadPage = () => {
  const { pno } = useParams()
  return <div className="p-4 w-full bg-white"><h1 className="text-3xl font-bold">Products Read Page</h1><ReadComponent pno={pno} /></div>
}
export default ReadPage
