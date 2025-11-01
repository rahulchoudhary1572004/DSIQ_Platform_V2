"use client"

import { useNavigate, useSearchParams } from "react-router-dom"
import ProductEditor from "../../components/PIM/product/ProductEditor"
import { useProductData } from "../../context/ProductDataContext"

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

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { viewTemplates, picklistOptions } = useProductData()

  const viewTemplate: string = searchParams.get("view") || "default"

  const handleSave = (productData: ProductData): void => {
    console.log("Creating new product:", productData)
    alert("Product created successfully!")
    navigate("/pim/products")
  }

  const handleCancel = (): void => {
    navigate("/pim/products")
  }

  const handleConfigure = (): void => {
    navigate(`/pim/views/${viewTemplate}/?returnTo=/products/new`)
  }

  return (
    <ProductEditor
      viewTemplates={viewTemplates}
      productData={{}}
      picklistOptions={picklistOptions}
      activeViewId={viewTemplate}
      onSave={handleSave}
      onCancel={handleCancel}
      onConfigure={handleConfigure}
      isEditMode={true}
      productId={null}
      pageTitle="Create New Product"
    />
  )
}

export default CreateProductPage
