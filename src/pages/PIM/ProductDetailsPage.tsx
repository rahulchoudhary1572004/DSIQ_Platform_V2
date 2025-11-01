import { useNavigate, useParams } from "react-router-dom"
import ProductViewer from "../../components/PIM/product/ProductViewer"
import { useProductData } from "../../context/ProductDataContext"
import ExportButton from '../../../helper_Functions/Export'
import { useRef, useMemo } from 'react'

// Type Definitions
interface Attribute {
  id: string;
  name: string;
  type?: string;
  [key: string]: any;
}

interface Section {
  id: string;
  name: string;
  attributes: Attribute[];
  [key: string]: any;
}

interface ViewTemplate {
  id: string;
  name: string;
  sections: Section[];
  [key: string]: any;
}

interface ProductData {
  id?: string;
  [key: string]: any;
}

interface PicklistOptions {
  [key: string]: string[] | any;
}

interface Column {
  field: string;
  title: string;
}

const ProductDetailsPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { viewTemplates, productData, picklistOptions } = useProductData()
  const gridRef = useRef<any>(null)

  const handleEdit = (): void => {
    navigate(`/${id}/edit`)
  }

  const handleBack = (): void => {
    navigate("/pim/products")
  }

  const handleConfigure = (): void => {
    navigate(`/pim/views/default`)
  }

  const columns = useMemo<Column[]>(() => {
    if (!viewTemplates || !viewTemplates.length) return []
    const template: ViewTemplate | undefined = viewTemplates.find((v: ViewTemplate) => v.id === 'default') || viewTemplates[0]
    if (!template) return []
    return template.sections.flatMap((section: Section) =>
      section.attributes.map((attr: Attribute) => ({ field: attr.id, title: attr.name }))
    )
  }, [viewTemplates])

  const exportData = useMemo<ProductData[]>(() => [productData], [productData])

  return (
    <>
      <div className="flex justify-end p-4">
        <ExportButton
          data={exportData}
          columns={columns}
          gridRef={gridRef}
          fileName={`ProductDetails_${id}`}
        />
      </div>
      <ProductViewer
        viewTemplates={viewTemplates}
        productData={productData}
        picklistOptions={picklistOptions}
        activeViewId="default"
        onEdit={handleEdit}
        onBack={handleBack}
        onConfigure={handleConfigure}
        productId={id || ""}
      />
    </>
  )
}

export default ProductDetailsPage
