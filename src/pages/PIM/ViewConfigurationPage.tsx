"use client"

import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import ViewConfigurator from "../../components/PIM/views/ViewConfigurator"
import { useProductData } from "../../context/ProductDataContext"

// Type Definitions
interface ViewTemplate {
  id: string;
  name: string;
  sections?: Section[];
  [key: string]: any;
}

interface Section {
  id: string;
  name: string;
  attributes?: Attribute[];
  [key: string]: any;
}

interface Attribute {
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  [key: string]: any;
}

interface PicklistOption {
  [key: string]: string[] | any;
}

interface ProductDataContext {
  viewTemplates: ViewTemplate[];
  setViewTemplates: (templates: ViewTemplate[]) => void;
  picklistOptions: PicklistOption;
  setPicklistOptions: (options: PicklistOption) => void;
}

const ViewConfigurationPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { viewTemplates, setViewTemplates, picklistOptions, setPicklistOptions } = useProductData() as ProductDataContext

  const handleSave = (): void => {
    console.log("Saving view configuration")
    alert("View configuration saved successfully!")
    navigate("/pim/views")
  }

  const handleBack = (): void => {
    navigate("/pim/products")
  }

  return (
    <ViewConfigurator
      viewTemplates={viewTemplates}
      setViewTemplates={setViewTemplates}
      activeViewId={id || "default"}
      picklistOptions={picklistOptions}
      setPicklistOptions={setPicklistOptions}
      onSave={handleSave}
      onBack={handleBack}
    />
  )
}

export default ViewConfigurationPage
