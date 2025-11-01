import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import ProductEditor from "../../components/PIM/product/ProductEditor"
import { useProductData } from "../../context/ProductDataContext"
import { useState } from "react"
import ProductVersionHistory from "../../components/PIM/product/ProductVersionHistory"

// Type Definitions
interface ProductData {
  [key: string]: any;
}

interface ViewTemplate {
  id: string;
  name: string;
  [key: string]: any;
}

interface PicklistOption {
  [key: string]: string[] | any;
}

interface Version {
  id: string;
  timestamp: string;
  data: ProductData;
  [key: string]: any;
}

const EditProductPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { viewTemplates, productData, picklistOptions } = useProductData()
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false)

  const viewTemplate: string = searchParams.get("view") || "default"

  const handleSave = (updatedProductData: ProductData): void => {
    console.log("Saving product changes:", updatedProductData)
    alert("Product updated successfully!")
    navigate(`/products/${id}`)
  }

  const handleCancel = (): void => {
    navigate(`/pim/products/${id}`)
  }

  const handleConfigure = (): void => {
    navigate(`/pim/views/${viewTemplate}?returnTo=/products/${id}/edit`)
  }

  const handleShowVersionHistory = (): void => setShowVersionHistory(true)
  const handleCloseVersionHistory = (): void => setShowVersionHistory(false)

  if (showVersionHistory) {
    return (
      <ProductVersionHistory
        product={productData}
        onClose={handleCloseVersionHistory}
        onRestore={(version: Version) => {
          // TODO: Implement restore logic
          setShowVersionHistory(false)
        }}
      />
    )
  }

  return (
    <ProductEditor
      viewTemplates={viewTemplates}
      productData={productData}
      picklistOptions={picklistOptions}
      activeViewId={viewTemplate}
      onSave={handleSave}
      onCancel={handleCancel}
      onConfigure={handleConfigure}
      isEditMode={true}
      productId={id || ""}
      pageTitle="Edit Product"
      onShowVersionHistory={handleShowVersionHistory}
    />
  )
}

export default EditProductPage
