import { useState, useMemo, useCallback, useRef, type JSX, type ClassAttributes, type HTMLAttributes, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal, type Ref } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid3X3,
  Download,
  Upload,
  Search,
  Filter,
  ChevronDown,
  X,
  Plus,
  Info,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Settings,
  EyeOff,
  Columns,
  Square,
  CheckSquare,
  FileText,
} from "lucide-react";
import { Grid, GridColumn as Column, GridPageChangeEvent, GridFilterChangeEvent, GridSortChangeEvent, GridGroupChangeEvent } from "@progress/kendo-react-grid";
import { Slider, NumericTextBox, NumericTextBoxChangeEvent, SliderChangeEvent } from "@progress/kendo-react-inputs";
import { process, State, CompositeFilterDescriptor, SortDescriptor, GroupDescriptor } from "@progress/kendo-data-query";
import { mockProducts } from "../../data/mockData";
import FloatingAddButton from "../../../helper_Functions/FloatingAddButton";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import ExportButton from "../../../helper_Functions/Export";
import { PDFExport } from '@progress/kendo-react-pdf';

// Type Definitions
interface FieldMappingTemplate {
  id: number;
  name: string;
  platform?: string;
  category?: string;
  retailers?: string[];
  fields: number;
  createdDate?: string;
}

interface NewProduct {
  name: string;
  category: string;
  view: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

interface EnhancedTemplate {
  id: number;
  name: string;
  category: string;
  retailers: string[];
  fields: number;
  createdDate: string;
}

interface TemplateAssignment {
  templateId: number;
  templateName: string;
  retailers: string[];
  productCount: number;
}

interface BulkTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onApply: (assignment: TemplateAssignment) => void;
}

interface ViewColumn {
  field: string;
  title: string;
  visible: boolean;
  required: boolean;
}

interface View {
  name: string;
  columns: ViewColumn[];
}

interface Filters {
  category: string;
  brand: string;
  status: string;
  completeness: string;
  syndicationStatus: string;
}

interface FilterOptions {
  categories: string[];
  brands: string[];
  statuses: string[];
}

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  filterOptions: FilterOptions;
  clearFilters: () => void;
  currentView: string;
  onViewChange: (viewName: string) => void;
  views: View[];
  onOpenViewManagement: () => void;
}

interface ViewManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  views: View[];
  onViewChange: (viewName: string) => void;
  onViewsUpdate: (views: View[]) => void;
}

interface Channel {
  name: string;
  status: string;
  reason: string;
  lastSync: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  status: string;
  completeness: number;
  channels: Channel[];
  lastModified: string;
}

interface ProcessedProduct extends Product {
  productName: string;
  categoryInfo: string;
  completenessPercent: number;
  channelsStatus: Channel[];
}

// Mock templates data
const fieldMappingTemplates: FieldMappingTemplate[] = [
  { id: 1, name: "Amazon Standard Template", platform: "Amazon", fields: 15 },
  { id: 2, name: "eBay Electronics Template", platform: "eBay", fields: 12 },
  { id: 3, name: "Shopify General Template", platform: "Shopify", fields: 10 },
  { id: 4, name: "Walmart Marketplace Template", platform: "Walmart", fields: 18 },
];

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    category: "",
    view: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit();
    setNewProduct({ name: "", category: "", view: "" });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(60, 61, 61, 0.5)" }}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(["name", "category"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field === "name" ? "Product Name" : "Category"}
              </label>
              <input
                type="text"
                value={newProduct[field]}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, [field]: e.target.value })
                }
                placeholder={`Enter ${
                  field === "name" ? "product name" : "category"
                }`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              View Template
            </label>
            <select
              value={newProduct.view}
              onChange={(e) =>
                setNewProduct({ ...newProduct, view: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>
                Select view template
              </option>
              <option value="default">Complete Product View</option>
              <option value="customer-facing">Customer View</option>
              <option value="inventory-warehouse">
                Inventory & Warehouse View
              </option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add More Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BulkTemplateModal: React.FC<BulkTemplateModalProps> = ({ isOpen, onClose, selectedCount, onApply }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<EnhancedTemplate | null>(null);
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);

  const enhancedTemplates: EnhancedTemplate[] = [
    {
      id: 1,
      name: "Amazon Standard Template",
      category: "Automotive",
      retailers: ["Amazon"],
      fields: 15,
      createdDate: "2025-10-15"
    },
    {
      id: 2,
      name: "Multi-Platform Electronics",
      category: "Electronics",
      retailers: ["Amazon", "eBay", "Walmart"],
      fields: 12,
      createdDate: "2025-10-20"
    },
    {
      id: 3,
      name: "Fashion Universal Template",
      category: "Fashion",
      retailers: ["Amazon", "Walmart", "Target", "Etsy"],
      fields: 10,
      createdDate: "2025-10-18"
    },
    {
      id: 4,
      name: "Walmart Marketplace Template",
      category: "General",
      retailers: ["Walmart"],
      fields: 18,
      createdDate: "2025-10-12"
    }
  ];

  if (!isOpen) return null;

  const handleTemplateSelect = (template: EnhancedTemplate): void => {
    setSelectedTemplate(template);
    setSelectedRetailers([]);
    setStep(2);
  };

  const handleRetailerToggle = (retailer: string): void => {
    setSelectedRetailers(prev => 
      prev.includes(retailer)
        ? prev.filter(r => r !== retailer)
        : [...prev, retailer]
    );
  };

  const handleBack = (): void => {
    setStep(1);
    setSelectedRetailers([]);
  };

  const handleClose = (): void => {
    setStep(1);
    setSelectedTemplate(null);
    setSelectedRetailers([]);
    onClose();
  };

  const handleApply = (): void => {
    if (!selectedTemplate || selectedRetailers.length === 0) {
      alert("Please select a template and at least one retailer");
      return;
    }

    const assignment: TemplateAssignment = {
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      retailers: selectedRetailers,
      productCount: selectedCount
    };

    onApply(assignment);
    handleClose();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                Bulk Template Assignment
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Assign field mapping templates to {selectedCount} selected products
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="text-sm font-medium">Select Template</span>
            </div>
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="text-sm font-medium">Choose Retailers</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Available Templates</h3>
                <span className="text-sm text-gray-500">{enhancedTemplates.length} templates</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enhancedTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-base">{template.name}</h4>
                      {selectedTemplate?.id === template.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{template.category}</span>
                        <span className="text-gray-400">•</span>
                        <span>{template.fields} fields</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.retailers.map((retailer) => (
                          <span key={retailer} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                            {retailer}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Created: {template.createdDate}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && selectedTemplate && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Selected Template</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-lg">{selectedTemplate.name}</h4>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                  <span className="bg-white px-3 py-1 rounded-full">{selectedTemplate.category}</span>
                  <span>•</span>
                  <span>{selectedTemplate.fields} fields</span>
                  <span>•</span>
                  <span>{selectedTemplate.retailers.length} supported retailers</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Target Retailers</h3>
                <p className="text-sm text-gray-600 mb-4">Choose which retailers you want to map this template to</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedTemplate.retailers.map((retailer) => (
                    <button
                      key={retailer}
                      onClick={() => handleRetailerToggle(retailer)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedRetailers.includes(retailer)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{retailer}</span>
                        {selectedRetailers.includes(retailer) ? (
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">Map to this retailer</span>
                    </button>
                  ))}
                </div>
                {selectedRetailers.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <CheckCircle className="inline h-4 w-4 mr-2" />
                      {selectedRetailers.length} retailer{selectedRetailers.length > 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {step === 1 && <span>Step 1 of 2: Choose a template to continue</span>}
            {step === 2 && (
              <span>
                Step 2 of 2: {selectedRetailers.length > 0 ? `${selectedRetailers.length} retailer(s) selected` : 'Select at least one retailer'}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {step === 2 && (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
            >
              Cancel
            </button>
            {step === 2 && (
              <button
                onClick={handleApply}
                disabled={selectedRetailers.length === 0}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  selectedRetailers.length > 0
                    ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                Apply to {selectedCount} Products
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCatalogHeader: React.FC = () => (
  <div className="flex justify-end items-center gap-4">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Product Catalog</h1>
      <p className="text-gray-600 mt-1">
        Manage your product information and syndication status
      </p>
    </div>
  </div>
);

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  filterOptions,
  clearFilters,
  currentView,
  onViewChange,
  views,
  onOpenViewManagement,
}) => {
  const activeFiltersCount: number = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white text-blue-600 rounded-full text-xs font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={currentView}
              onChange={(e) => onViewChange(e.target.value)}
              className="pl-4 pr-10 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {views.map((view) => (
                <option key={view.name} value={view.name}>
                  {view.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
          </div>

          <button
            onClick={onOpenViewManagement}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Columns className="h-5 w-5" />
            Manage Views
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {filterOptions.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) =>
                  setFilters({ ...filters, brand: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Brands</option>
                {filterOptions.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {filterOptions.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completeness
              </label>
              <select
                value={filters.completeness}
                onChange={(e) =>
                  setFilters({ ...filters, completeness: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="complete">Complete (90-100%)</option>
                <option value="good">Good (70-89%)</option>
                <option value="fair">Fair (50-69%)</option>
                <option value="poor">Poor (&lt;50%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Syndication
              </label>
              <select
                value={filters.syndicationStatus}
                onChange={(e) =>
                  setFilters({ ...filters, syndicationStatus: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="ready">Ready</option>
                <option value="synced">Synced</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProductLegend: React.FC = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <Info className="h-5 w-5 text-blue-600" />
      <h3 className="font-semibold text-gray-900">Status Legend</h3>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: CheckCircle, label: "Synced", color: "text-green-600", bg: "bg-green-50" },
        { icon: Clock, label: "Pending", color: "text-yellow-600", bg: "bg-yellow-50" },
        { icon: XCircle, label: "Failed", color: "text-red-600", bg: "bg-red-50" },
        { icon: AlertCircle, label: "Needs Attention", color: "text-orange-600", bg: "bg-orange-50" },
      ].map(({ icon: Icon, label, color, bg }) => (
        <div key={label} className={`flex items-center gap-2 ${bg} px-3 py-2 rounded-lg`}>
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

const ProductStatsCards: React.FC = () => {
  const stats = [
    { label: "Total Products", value: "1,247", change: "+12%", positive: true, icon: "📦" },
    { label: "Active", value: "1,156", change: "+8%", positive: true, icon: "✅" },
    { label: "Synced", value: "892", change: "+15%", positive: true, icon: "🔄" },
    { label: "Needs Review", value: "91", change: "-5%", positive: false, icon: "⚠️" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{stat.icon}</span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

const ViewManagementModal: React.FC<ViewManagementModalProps> = ({
  isOpen,
  onClose,
  currentView,
  views,
  onViewChange,
  onViewsUpdate,
}) => {
  const [tempViews, setTempViews] = useState<View[]>(views);
  const [selectedViewIndex, setSelectedViewIndex] = useState<number>(
    views.findIndex((v) => v.name === currentView)
  );
  const [search, setSearch] = useState<string>("");

  if (!isOpen) return null;

  const handleSave = (): void => {
    onViewsUpdate(tempViews);
    if (selectedViewIndex >= 0) {
      onViewChange(tempViews[selectedViewIndex].name);
    }
    onClose();
  };

  const handleDragEnd = (result: DropResult): void => {
    if (!result.destination || selectedViewIndex < 0) return;

    const items = Array.from(tempViews[selectedViewIndex].columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedViews = [...tempViews];
    updatedViews[selectedViewIndex] = {
      ...updatedViews[selectedViewIndex],
      columns: items,
    };
    setTempViews(updatedViews);
  };

  const toggleColumnVisibility = (field: string): void => {
    if (selectedViewIndex < 0) return;

    const updatedViews = [...tempViews];
    const column = updatedViews[selectedViewIndex].columns.find(
      (col) => col.field === field
    );

    if (column && !column.required) {
      column.visible = !column.visible;
      setTempViews(updatedViews);
    }
  };

  const filteredColumns =
    selectedViewIndex >= 0
      ? tempViews[selectedViewIndex].columns.filter((col) =>
          col.title.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Columns className="h-5 w-5" />
            Manage Views
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Views</h3>
            <div className="space-y-1">
              {tempViews.map((view, index) => (
                <button
                  key={view.name}
                  onClick={() => setSelectedViewIndex(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedViewIndex === index
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {view.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {selectedViewIndex >= 0 && (
              <>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search columns..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Visible Columns
                    </h3>
                    <span className="text-xs text-gray-500">
                      {tempViews[selectedViewIndex].columns.filter((col) => col.visible).length}{" "}
                      of {tempViews[selectedViewIndex].columns.length} columns
                    </span>
                  </div>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="columns">
                    {(provided: { droppableProps: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>; innerRef: Ref<HTMLDivElement> | undefined; placeholder: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {filteredColumns.map((column, index) => (
                          <Draggable
                            key={column.field}
                            draggableId={column.field}
                            index={index}
                            isDragDisabled={column.required}
                          >
                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg ${
                                  snapshot.isDragging ? "shadow-lg bg-blue-50" : "bg-white"
                                } ${column.required ? "opacity-75" : ""}`}
                              >
                                <Grid3X3 className="h-4 w-4 text-gray-400" />
                                <button
                                  onClick={() => toggleColumnVisibility(column.field)}
                                  disabled={column.required}
                                  className={`${column.required ? "cursor-not-allowed" : ""}`}
                                >
                                  {column.visible ? (
                                    <Eye className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                                <span className={`flex-1 text-sm ${column.visible ? "text-gray-900" : "text-gray-400"}`}>
                                  {column.title}
                                </span>
                                {column.required && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                    Required
                                  </span>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showViewManagementModal, setShowViewManagementModal] = useState<boolean>(false);
  const [showBulkTemplateModal, setShowBulkTemplateModal] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    brand: "",
    status: "",
    completeness: "",
    syndicationStatus: "",
  });

  const [views, setViews] = useState<View[]>([
    {
      name: "Complete Product View",
      columns: [
        { field: "select", title: "Select", visible: true, required: true },
        { field: "productName", title: "Product Name", visible: true, required: true },
        { field: "sku", title: "SKU", visible: true, required: true },
        { field: "categoryInfo", title: "Category", visible: true, required: false },
        { field: "brand", title: "Brand", visible: true, required: false },
        { field: "status", title: "Status", visible: true, required: false },
        { field: "completenessPercent", title: "Completeness", visible: true, required: false },
        { field: "channelsStatus", title: "Channels", visible: true, required: false },
        { field: "lastModified", title: "Last Modified", visible: true, required: false },
        { field: "actions", title: "Actions", visible: true, required: true },
      ],
    },
    {
      name: "Customer Facing View",
      columns: [
        { field: "select", title: "Select", visible: true, required: true },
        { field: "productName", title: "Product Name", visible: true, required: true },
        { field: "brand", title: "Brand", visible: true, required: false },
        { field: "status", title: "Status", visible: true, required: false },
        { field: "channelsStatus", title: "Channels", visible: true, required: false },
        { field: "actions", title: "Actions", visible: true, required: true },
      ],
    },
    {
      name: "Inventory & Warehouse View",
      columns: [
        { field: "select", title: "Select", visible: true, required: true },
        { field: "sku", title: "SKU", visible: true, required: true },
        { field: "productName", title: "Product Name", visible: true, required: true },
        { field: "categoryInfo", title: "Category", visible: true, required: false },
        { field: "lastModified", title: "Last Modified", visible: true, required: false },
        { field: "actions", title: "Actions", visible: true, required: true },
      ],
    },
  ]);
  
  const [currentView, setCurrentView] = useState<string>("Complete Product View");
  const [gridFilter, setGridFilter] = useState<CompositeFilterDescriptor>({ logic: "and", filters: [] });
  const [sort, setSort] = useState<SortDescriptor[]>([]);
  const [group, setGroup] = useState<GroupDescriptor[]>([]);
  const [page, setPage] = useState<{ skip: number; take: number }>({ skip: 0, take: 10 });

  const gridRef = useRef<Grid>(null);
  const pdfExportComponent = useRef<PDFExport>(null);

  const filterOptions: FilterOptions = {
    categories: Array.from(new Set(mockProducts.map((p: { category: any; }) => p.category))),
    brands: Array.from(new Set(mockProducts.map((p: { brand: any; }) => p.brand))),
    statuses: ["Active", "Draft", "Archived"],
  };

  const processedProducts: ProcessedProduct[] = useMemo(() => {
    return mockProducts.map((product: { name: any; category: any; subcategory: any; completeness: any; channels: any; }) => ({
      ...product,
      productName: product.name,
      categoryInfo: `${product.category} > ${product.subcategory}`,
      completenessPercent: product.completeness,
      channelsStatus: product.channels,
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = processedProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !filters.category || product.category === filters.category;
      const matchesBrand = !filters.brand || product.brand === filters.brand;
      const matchesStatus = !filters.status || product.status === filters.status;

      const matchesCompleteness = !filters.completeness ||
        (filters.completeness === "complete" && product.completeness >= 90) ||
        (filters.completeness === "good" && product.completeness >= 70 && product.completeness < 90) ||
        (filters.completeness === "fair" && product.completeness >= 50 && product.completeness < 70) ||
        (filters.completeness === "poor" && product.completeness < 50);

      const matchesSyndication = !filters.syndicationStatus ||
        product.channels.some((ch) => ch.status === filters.syndicationStatus);

      return matchesSearch && matchesCategory && matchesBrand && matchesStatus && matchesCompleteness && matchesSyndication;
    });

    return filtered;
  }, [processedProducts, searchTerm, filters]);

  const dataState: State = useMemo(
    () => ({
      skip: page.skip,
      take: page.take,
      filter: gridFilter,
      sort: sort,
      group: group,
    }),
    [page, gridFilter, sort, group]
  );

  const gridData = useMemo(
    () => process(filteredProducts, dataState),
    [filteredProducts, dataState]
  );

  const currentViewConfig = useMemo(
    () => views.find((v) => v.name === currentView) || views[0],
    [views, currentView]
  );

  const visibleColumns = useMemo(
    () => currentViewConfig.columns.filter((col) => col.visible),
    [currentViewConfig]
  );

  const handleSelectAll = useCallback((checked: boolean): void => {
    if (checked) {
      const allIds = new Set(filteredProducts.map((p) => p.id));
      setSelectedProducts(allIds);
    } else {
      setSelectedProducts(new Set());
    }
  }, [filteredProducts]);

  const handleSelectProduct = useCallback((productId: number): void => {
    setSelectedProducts((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(productId)) {
        newSelection.delete(productId);
      } else {
        newSelection.add(productId);
      }
      return newSelection;
    });
  }, []);

  const handleApplyTemplate = (assignment: TemplateAssignment): void => {
    const template = fieldMappingTemplates.find((t) => t.id === assignment.templateId);
    console.log("Applying template:", template);
    console.log("To products:", Array.from(selectedProducts));
    console.log("For retailers:", assignment.retailers);

    alert(
      `Template "${template?.name}" assigned to ${selectedProducts.size} products for ${assignment.retailers.length} retailer(s) successfully!`
    );

    setSelectedProducts(new Set());
    setShowBulkTemplateModal(false);
  };

  const clearFilters = (): void => {
    setFilters({
      category: "",
      brand: "",
      status: "",
      completeness: "",
      syndicationStatus: "",
    });
  };

  const handleAddProduct = (): void => {
    navigate(`/pim/products/new?view=${currentView}`);
    setShowAddModal(false);
  };

  const handleViewProduct = (productId: number): void => {
    navigate(`/pim/products/${productId}?view=${currentView}`);
  };

  const handleEditProduct = (productId: number): void => {
    navigate(`/pim/products/${productId}/edit?view=${currentView}`);
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case "synced":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCompletenessColor = (completeness: number): string => {
    if (completeness >= 90) return "text-green-600 bg-green-50";
    if (completeness >= 70) return "text-blue-600 bg-blue-50";
    if (completeness >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const SelectionCell = (props: any): JSX.Element => {
    const isSelected = selectedProducts.has(props.dataItem.id);
    return (
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleSelectProduct(props.dataItem.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
    );
  };

  const ProductNameCell = (props: any): JSX.Element => (
    <td className="font-medium text-gray-900">{props.dataItem.productName}</td>
  );

  const CategoryCell = (props: any): JSX.Element => (
    <td>
      <span className="text-sm text-gray-600">{props.dataItem.categoryInfo}</span>
    </td>
  );

  const StatusCell = (props: any): JSX.Element => (
    <td>
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          props.dataItem.status === "Active"
            ? "bg-green-100 text-green-700"
            : props.dataItem.status === "Draft"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {props.dataItem.status}
      </span>
    </td>
  );

  const CompletenessCell = (props: any): JSX.Element => (
    <td>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${props.dataItem.completenessPercent}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getCompletenessColor(props.dataItem.completenessPercent)}`}>
          {props.dataItem.completenessPercent}%
        </span>
      </div>
    </td>
  );

  const ChannelsCell = (props: any): JSX.Element => (
    <td>
      <div className="flex gap-1">
        {props.dataItem.channelsStatus.map((channel: Channel, idx: number) => (
          <div
            key={idx}
            className="group relative"
            title={`${channel.name}: ${channel.status}`}
          >
            {getStatusIcon(channel.status)}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {channel.name}: {channel.status}
            </div>
          </div>
        ))}
      </div>
    </td>
  );

  const ActionsCell = (props: any): JSX.Element => (
    <td>
      <div className="flex gap-2">
        <button
          onClick={() => handleViewProduct(props.dataItem.id)}
          className="p-1 text-gray-600 hover:text-blue-600"
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleEditProduct(props.dataItem.id)}
          className="p-1 text-gray-600 hover:text-blue-600"
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </button>
      </div>
    </td>
  );

  const exportPDF = (): void => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <ProductCatalogHeader />
      <ProductStatsCards />
      <ProductLegend />
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        clearFilters={clearFilters}
        currentView={currentView}
        onViewChange={setCurrentView}
        views={views}
        onOpenViewManagement={() => setShowViewManagementModal(true)}
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Products ({filteredProducts.length})
            </h2>
            {selectedProducts.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedProducts.size} selected
                </span>
                <button
                  onClick={() => setShowBulkTemplateModal(true)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <Upload className="h-4 w-4" />
                  Assign Template
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <ExportButton
              data={filteredProducts}
              filename="products"
              onExportPDF={exportPDF}
            />
          </div>
        </div>

        <PDFExport ref={pdfExportComponent} paperSize="A4">
          <Grid
            ref={gridRef}
            data={gridData}
            sortable
            filterable
            groupable
            pageable
            pageSize={page.take}
            skip={page.skip}
            total={filteredProducts.length}
            onPageChange={(e: GridPageChangeEvent) => setPage({ skip: e.page.skip, take: e.page.take })}
            onFilterChange={(e: GridFilterChangeEvent) => setGridFilter(e.filter)}
            onSortChange={(e: GridSortChangeEvent) => setSort(e.sort)}
            onGroupChange={(e: GridGroupChangeEvent) => setGroup(e.group)}
          >
            {visibleColumns.map((col) => {
              if (col.field === "select") {
                return (
                  <Column
                    key={col.field}
                    field={col.field}
                    title={
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    }
                    width="50px"
                    cell={SelectionCell}
                    filterable={false}
                    sortable={false}
                  />
                );
              }

              if (col.field === "productName") {
                return <Column key={col.field} field={col.field} title={col.title} cell={ProductNameCell} />;
              }
              if (col.field === "categoryInfo") {
                return <Column key={col.field} field={col.field} title={col.title} cell={CategoryCell} />;
              }
              if (col.field === "status") {
                return <Column key={col.field} field={col.field} title={col.title} cell={StatusCell} />;
              }
              if (col.field === "completenessPercent") {
                return <Column key={col.field} field={col.field} title={col.title} cell={CompletenessCell} />;
              }
              if (col.field === "channelsStatus") {
                return <Column key={col.field} field={col.field} title={col.title} cell={ChannelsCell} filterable={false} sortable={false} />;
              }
              if (col.field === "actions") {
                return <Column key={col.field} field={col.field} title={col.title} cell={ActionsCell} filterable={false} sortable={false} width="100px" />;
              }

              return <Column key={col.field} field={col.field} title={col.title} />;
            })}
          </Grid>
        </PDFExport>
      </div>

      <FloatingAddButton
        onClick={() => setShowAddModal(true)}
        label="Add Product"
        icon={Plus}
      />

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProduct}
      />

      <ViewManagementModal
        isOpen={showViewManagementModal}
        onClose={() => setShowViewManagementModal(false)}
        currentView={currentView}
        views={views}
        onViewChange={setCurrentView}
        onViewsUpdate={setViews}
      />

      <BulkTemplateModal
        isOpen={showBulkTemplateModal}
        onClose={() => setShowBulkTemplateModal(false)}
        selectedCount={selectedProducts.size}
        onApply={handleApplyTemplate}
      />
    </div>
  );
};

export default ProductCatalogPage;
