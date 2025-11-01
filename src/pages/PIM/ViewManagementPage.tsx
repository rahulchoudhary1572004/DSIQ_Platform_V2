"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useProductData } from "../../context/ProductDataContext"
import { Plus, X, Search, Trash2, Copy, Settings, Eye, ArrowLeft } from "lucide-react"
import FloatingAddButton from "../../../helper_Functions/FloatingAddButton"

// Type Definitions
interface Attribute {
  id: string;
  name: string;
  type?: string;
  required?: boolean;
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
  description: string;
  isDefault?: boolean;
  sections: Section[];
  createdAt: string;
  lastModified: string;
  [key: string]: any;
}

interface NewViewData {
  name: string;
  description: string;
  sourceViewId: string;
}

interface ProductDataContextType {
  viewTemplates: ViewTemplate[];
  [key: string]: any;
}

const ViewManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const { viewTemplates } = useProductData() as ProductDataContextType
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [newViewData, setNewViewData] = useState<NewViewData>({
    name: "",
    description: "",
    sourceViewId: "",
  })

  const handleConfigureView = (viewId: string): void => {
    navigate(`/pim/views/${viewId}`)
  }

  const handleCreateView = (viewData: NewViewData): void => {
    console.log("Creating view:", viewData)
    setShowCreateModal(false)
    setNewViewData({ name: "", description: "", sourceViewId: "" })
    navigate(`/pim/views/${viewData.sourceViewId}/configure`)
  }

  const handleDeleteView = (viewId: string): void => {
    const view: ViewTemplate | undefined = viewTemplates.find((v: ViewTemplate) => v.id === viewId)
    if (view?.isDefault) {
      alert("Cannot delete the default view")
      return
    }
    console.log("Deleting view:", viewId)
  }

  const handleBack = (): void => {
    navigate("/pim/products")
  }

  const filteredViews: ViewTemplate[] = viewTemplates.filter(
    (view: ViewTemplate) =>
      view.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      view.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (newViewData.name && newViewData.sourceViewId) {
      handleCreateView(newViewData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Views List */}
      <>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-2 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Product Views</h1>
              <p className="text-gray-600 mt-1">Manage your product view templates</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search views..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Views Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredViews.map((view: ViewTemplate) => (
            <div
              key={view.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{view.name}</h3>
                    {view.isDefault && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{view.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sections:</span>
                  <span className="font-medium">{view.sections.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Fields:</span>
                  <span className="font-medium">
                    {view.sections.reduce((total: number, section: Section) => total + section.attributes.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">{view.createdAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Modified:</span>
                  <span className="font-medium">{view.lastModified}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleConfigureView(view.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Settings className="h-3 w-3" />
                  Configure
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  title="Duplicate View"
                >
                  <Copy className="h-3 w-3" />
                </button>
                {!view.isDefault && (
                  <button
                    onClick={() => handleDeleteView(view.id)}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm"
                    title="Delete View"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredViews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No views found</h3>
              <p>Try adjusting your search or create a new view</p>
            </div>
          </div>
        )}
      </>

      {/* Simple Floating Button */}
      <FloatingAddButton
        onClick={() => setShowCreateModal(true)}
        label="Create View"
        icon={Plus}
      />

      {/* Create View Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setShowCreateModal(false)
                setNewViewData({ name: "", description: "", sourceViewId: "" })
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New View</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View Name</label>
                <input
                  type="text"
                  value={newViewData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewViewData({ ...newViewData, name: e.target.value })}
                  placeholder="Enter view name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newViewData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewViewData({ ...newViewData, description: e.target.value })}
                  placeholder="Enter view description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Template</label>
                <select
                  value={newViewData.sourceViewId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewViewData({ ...newViewData, sourceViewId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select a template to copy from
                  </option>
                  {viewTemplates.map((view: ViewTemplate) => (
                    <option key={view.id} value={view.id}>
                      {view.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewViewData({ name: "", description: "", sourceViewId: "" })
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create View
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewManagementPage
