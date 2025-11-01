import { useState, useMemo, type JSX } from "react";
import {
  Search,
  Upload,
  Eye,
  Download,
  Edit,
  Trash2,
  ImageIcon,
  Video,
  FileText,
  Music,
  Archive,
  HardDrive,
  X,
  LucideIcon,
} from "lucide-react";
import FloatingAddButton from "../../../helper_Functions/FloatingAddButton";

// Type Definitions
interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  status: string;
  assetCount: number;
  thumbnail: string;
}

interface DigitalAsset {
  id: number;
  name: string;
  type: "image" | "video" | "document" | "audio" | "archive";
  size: string;
  format: string;
  uploadDate: string;
  uploadedBy: string;
  url: string;
  thumbnail: string | null;
  duration?: string;
  dimensions?: string;
  pages?: number;
  files?: number;
}

interface AssetCardProps {
  asset: DigitalAsset;
  onClick: (asset: DigitalAsset) => void;
}

interface DigitalAssetsMap {
  [key: number]: DigitalAsset[];
}

// Mock data for products
const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    sku: "WHP-001",
    category: "Electronics",
    status: "Active",
    assetCount: 12,
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Smart Watch Series X",
    sku: "SWX-002",
    category: "Wearables",
    status: "Active",
    assetCount: 8,
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Bluetooth Speaker Mini",
    sku: "BSM-003",
    category: "Audio",
    status: "Draft",
    assetCount: 5,
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "Gaming Keyboard RGB",
    sku: "GKR-004",
    category: "Gaming",
    status: "Active",
    assetCount: 15,
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    name: "Wireless Mouse Pro",
    sku: "WMP-005",
    category: "Accessories",
    status: "Active",
    assetCount: 7,
    thumbnail: "/placeholder.svg?height=60&width=60",
  },
];

// Mock data for digital assets
const digitalAssets: DigitalAssetsMap = {
  1: [
    {
      id: 101,
      name: "headphones-product-demo.mp4",
      type: "video",
      size: "15.2 MB",
      duration: "0:45",
      format: "MP4",
      uploadDate: "2024-01-14",
      uploadedBy: "Jane Smith",
      url: "/placeholder.svg?height=300&width=300",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    },
    {
      id: 102,
      name: "headphones-hero-image.jpg",
      type: "image",
      size: "2.4 MB",
      dimensions: "1920x1080",
      format: "JPEG",
      uploadDate: "2024-01-15",
      uploadedBy: "John Doe",
      url: "/placeholder.svg?height=300&width=300",
      thumbnail: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
    },
    {
      id: 103,
      name: "headphones-specifications.pdf",
      type: "document",
      size: "1.1 MB",
      pages: 4,
      format: "PDF",
      uploadDate: "2024-01-13",
      uploadedBy: "Mike Johnson",
      url: "/placeholder.svg?height=300&width=300",
      thumbnail: null,
    },
    {
      id: 104,
      name: "headphones-lifestyle-1.jpg",
      type: "image",
      size: "3.1 MB",
      dimensions: "2048x1536",
      format: "JPEG",
      uploadDate: "2024-01-12",
      uploadedBy: "Sarah Wilson",
      url: "/placeholder.svg?height=300&width=300",
      thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop",
    },
    {
      id: 105,
      name: "headphones-unboxing.jpg",
      type: "image",
      size: "2.8 MB",
      dimensions: "1800x1200",
      format: "JPEG",
      uploadDate: "2024-01-11",
      uploadedBy: "Tom Brown",
      url: "/placeholder.svg?height=300&width=300",
      thumbnail: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=300&fit=crop",
    },
    {
      id: 106,
      name: "headphones-360-view.zip",
      type: "archive",
      size: "45.6 MB",
      files: 36,
      format: "ZIP",
      uploadDate: "2024-01-10",
      uploadedBy: "Alex Davis",
      url: "/placeholder.svg?height=300&width=300",
      thumbnail: null,
    },
  ],
  2: [
    {
      id: 201,
      name: "smartwatch-hero.jpg",
      type: "image",
      size: "2.1 MB",
      dimensions: "1920x1080",
      format: "JPEG",
      uploadDate: "2024-01-20",
      uploadedBy: "Lisa Chen",
      url: "/placeholder.svg?height=300&width=300",
      thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    },
    {
      id: 202,
      name: "smartwatch-features.mp4",
      type: "video",
      size: "22.5 MB",
      duration: "1:30",
      format: "MP4",
      uploadDate: "2024-01-19",
      uploadedBy: "David Kim",
      url: "/placeholder.svg?height=300&width=300",
      thumbnail: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop",
    },
  ],
};

const getAssetIcon = (type: DigitalAsset["type"]): JSX.Element => {
  switch (type) {
    case "image":
      return <ImageIcon className="h-5 w-5" />;
    case "video":
      return <Video className="h-5 w-5" />;
    case "document":
      return <FileText className="h-5 w-5" />;
    case "audio":
      return <Music className="h-5 w-5" />;
    case "archive":
      return <Archive className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getAssetTypeColor = (type: DigitalAsset["type"]): string => {
  switch (type) {
    case "image":
      return "bg-blue-100 text-blue-700";
    case "video":
      return "bg-purple-100 text-purple-700";
    case "document":
      return "bg-green-100 text-green-700";
    case "audio":
      return "bg-orange-100 text-orange-700";
    case "archive":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Asset Card Component
const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick }) => {
  const hasPreview: boolean = asset.thumbnail !== null || asset.type === "image" || asset.type === "video";
  
  return (
    <div className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300">
      {/* Card Image/Preview */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-50 overflow-hidden">
        {hasPreview ? (
          <img
            src={asset.thumbnail || asset.url}
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`rounded-full p-6 ${getAssetTypeColor(asset.type)}`}>
              {getAssetIcon(asset.type)}
            </div>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onClick(asset)}
            className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
            title="View details"
          >
            <Eye className="h-4 w-4 text-neutral-700" />
          </button>
          <button
            className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4 text-neutral-700" />
          </button>
          <button
            className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4 text-neutral-700" />
          </button>
          <button
            className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getAssetTypeColor(asset.type)} shadow-sm`}>
            {getAssetIcon(asset.type)}
            <span className="ml-1.5 capitalize">{asset.type}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 text-sm mb-2 truncate" title={asset.name}>
          {asset.name}
        </h3>
        
        <div className="space-y-1.5 text-xs text-neutral-500">
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-700">{asset.format}</span>
            <span>{asset.size}</span>
          </div>
          
          {asset.dimensions && (
            <div className="flex items-center justify-between">
              <span>Dimensions:</span>
              <span className="font-mono">{asset.dimensions}</span>
            </div>
          )}
          
          {asset.duration && (
            <div className="flex items-center justify-between">
              <span>Duration:</span>
              <span className="font-mono">{asset.duration}</span>
            </div>
          )}
          
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Uploaded by</span>
              <span className="font-medium text-neutral-600">{asset.uploadedBy}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-neutral-400">Modified</span>
              <span>{asset.uploadDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DAMPage(): JSX.Element {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const currentAssets: DigitalAsset[] = digitalAssets[selectedProduct.id] || [];

  const filteredAssets = useMemo<DigitalAsset[]>(() => {
    return currentAssets.filter((asset) => {
      const matchesSearch: boolean = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType: boolean = filterType === "all" || asset.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [currentAssets, searchTerm, filterType]);

  const handleUploadClick = (): void => {
    console.log("Upload assets clicked");
  };

  const handleAssetClick = (asset: DigitalAsset): void => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-neutral-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-neutral-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-4 tracking-tight">Products</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50 text-sm"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-auto p-2 space-y-1">
          {products.map((product) => (
            <button
              key={product.id}
              className={`w-full text-left px-4 py-3 rounded-lg flex flex-col border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedProduct.id === product.id
                  ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500 shadow"
                  : "bg-white border-transparent hover:bg-neutral-50"
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              <span className="font-medium text-neutral-900 truncate">{product.name}</span>
              <span className="text-xs text-neutral-500">{product.sku}</span>
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {product.status}
                </span>
                <span className="text-xs text-neutral-400">{product.assetCount} assets</span>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-8 py-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Digital Asset Management</h1>
              <p className="text-neutral-500 text-sm mt-1">
                Managing assets for: <span className="font-semibold text-neutral-800">{selectedProduct.name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50 text-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-44 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-50 text-sm"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="audio">Audio</option>
              <option value="archive">Archives</option>
            </select>
          </div>
        </header>

        {/* Asset Grid */}
        <section className="flex-1 px-8 py-6 overflow-auto">
          {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
              <HardDrive className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assets found</h3>
              <p className="text-sm">Upload some assets to get started</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {filteredAssets.length} {filteredAssets.length === 1 ? 'asset' : 'assets'} found
                </h3>
              </div>

              {/* Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredAssets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onClick={handleAssetClick}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Floating Upload Button */}
      <FloatingAddButton 
        onClick={handleUploadClick}
        label="Upload Assets"
        icon={Upload}
      />

      {/* Asset Details Modal */}
      {isModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden animate-fadeIn">
            <button
              className="absolute top-4 right-4 z-10 text-white hover:text-neutral-200 focus:outline-none bg-black/30 rounded-full p-2 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col md:flex-row">
              {/* Preview Section */}
              <div className="md:w-1/2 bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center p-8 min-h-[300px] md:min-h-[500px] relative">
                {selectedAsset.thumbnail ? (
                  <img
                    src={selectedAsset.thumbnail}
                    alt={selectedAsset.name}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className={`rounded-2xl p-12 ${getAssetTypeColor(selectedAsset.type)}`}>
                    {getAssetIcon(selectedAsset.type)}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="md:w-1/2 p-8 flex flex-col">
                <div className="flex-1">
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getAssetTypeColor(selectedAsset.type)}`}>
                      {getAssetIcon(selectedAsset.type)}
                      <span className="ml-1.5 capitalize">{selectedAsset.type}</span>
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6 break-words">{selectedAsset.name}</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 block mb-1">Format</span>
                        <span className="font-semibold text-neutral-900">{selectedAsset.format}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block mb-1">Size</span>
                        <span className="font-semibold text-neutral-900">{selectedAsset.size}</span>
                      </div>
                    </div>

                    {selectedAsset.dimensions && (
                      <div>
                        <span className="text-neutral-500 block mb-1 text-sm">Dimensions</span>
                        <span className="font-semibold text-neutral-900">{selectedAsset.dimensions}</span>
                      </div>
                    )}

                    {selectedAsset.duration && (
                      <div>
                        <span className="text-neutral-500 block mb-1 text-sm">Duration</span>
                        <span className="font-semibold text-neutral-900">{selectedAsset.duration}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-neutral-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500 block mb-1">Uploaded</span>
                          <span className="font-medium text-neutral-900">{selectedAsset.uploadDate}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block mb-1">By</span>
                          <span className="font-medium text-neutral-900">{selectedAsset.uploadedBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 mt-6 border-t border-neutral-200">
                  <button className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                    <Download className="h-4 w-4 mr-2" /> Download
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </button>
                  <button className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
