import React, { useState, useMemo, useCallback, useRef, type JSX } from "react";
import { RefreshCw, Download, Search } from "lucide-react";
import { Grid, GridColumn as Column, GridFilterChangeEvent, GridPageChangeEvent } from "@progress/kendo-react-grid";
import { Slider, NumericTextBox, NumericTextBoxChangeEvent, SliderChangeEvent } from "@progress/kendo-react-inputs";
import { process, CompositeFilterDescriptor } from "@progress/kendo-data-query";
import ExportButton from '../../../helper_Functions/Export';

// Type Definitions
interface Stats {
  total: number;
  success: number;
  failed: number;
  inProgress: number;
}

interface SyndicationRow {
  product: string;
  retailer: string;
  status: "Success" | "Failed" | "In Progress";
  lastSync: string;
  message: string;
}

interface StatusColorMap {
  [key: string]: string;
}

interface ColumnDefinition {
  field: string;
  title: string;
}

interface GridCellProps {
  dataItem: SyndicationRow;
  [key: string]: any;
}

interface PagerProps {
  skip: number;
  take: number;
  total: number;
  onPageChange?: (event: GridPageChangeEvent) => void;
}

interface PageState {
  skip: number;
  take: number;
}

const mockStats: Stats = {
  total: 4,
  success: 2,
  failed: 1,
  inProgress: 1,
};

const mockRows: SyndicationRow[] = [
  {
    product: "Wireless Bluetooth Headphones",
    retailer: "Amazon",
    status: "Success",
    lastSync: "2024-01-15 10:30",
    message: "Successfully synced",
  },
  {
    product: "Organic Cotton T-Shirt",
    retailer: "Walmart",
    status: "Failed",
    lastSync: "2024-01-15 09:15",
    message: "Missing required field: brand_name",
  },
  {
    product: "Eco Water Bottle",
    retailer: "Target",
    status: "In Progress",
    lastSync: "2024-01-15 08:45",
    message: "Syncing...",
  },
  {
    product: "Yoga Mat Pro",
    retailer: "Shopify",
    status: "Success",
    lastSync: "2024-01-14 17:20",
    message: "Successfully synced",
  },
];

const statusColor: StatusColorMap = {
  Success: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  "In Progress": "bg-amber-100 text-amber-800",
};

const statusCell = (props: GridCellProps): JSX.Element => {
  const value: string = props.dataItem.status;
  const { status } = props.dataItem;
  return (
    <td className="flex justify-between">
      <span
        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusColor[value] || "bg-gray-100 text-gray-800"
        }`}
      >
        {value}
      </span>
      {status === "Failed" && (
        <div className="inline-flex">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      )}
    </td>
  );
};

const messageCell = (props: GridCellProps): JSX.Element => {
  const { message } = props.dataItem;
  return (
    <td className="align-top">
      <div>{message}</div>
    </td>
  );
};

const MyPager: React.FC<PagerProps> = (props) => {
  const currentPage: number = Math.floor(props.skip / props.take) + 1;
  const totalPages: number = Math.ceil((props.total || 0) / props.take) || 1;
  
  const handleChange = (event: NumericTextBoxChangeEvent | SliderChangeEvent): void => {
    const value = event.value ?? 1;
    props.onPageChange?.({
      target: { element: null, props },
      skip: (value - 1) * props.take,
      take: props.take,
      syntheticEvent: event.syntheticEvent,
      nativeEvent: event.nativeEvent,
      targetEvent: { value: value },
    } as GridPageChangeEvent);
  };

  return (
    <div
      className="k-pager k-pager-md k-grid-pager"
      style={{ borderTop: "1px solid", borderTopColor: "inherit" }}
    >
      <div className="flex items-center justify-between p-2">
        <div className="flex-1">
          <Slider
            buttons={true}
            step={1}
            value={currentPage}
            min={1}
            max={totalPages}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1 flex justify-center">
          <NumericTextBox
            value={currentPage}
            onChange={handleChange}
            min={1}
            max={totalPages}
            width={60}
          />
        </div>
        <div className="flex-1 text-right text-sm text-gray-600">{`Page ${currentPage} of ${totalPages}`}</div>
      </div>
    </div>
  );
};

const Syndication: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");
  const [gridPage, setGridPage] = useState<PageState>({ skip: 0, take: 10 });
  const [gridFilter, setGridFilter] = useState<CompositeFilterDescriptor>({ logic: "and", filters: [] });
  const gridRef = useRef<Grid>(null);

  const filteredRows = useMemo<SyndicationRow[]>(() => {
    return mockRows.filter((row) => {
      const matchesSearch: boolean =
        row.product.toLowerCase().includes(search.toLowerCase()) ||
        row.retailer.toLowerCase().includes(search.toLowerCase());
      const matchesFilter: boolean = filter === "All" || row.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const processedData = useMemo(() => {
    return process(filteredRows, {
      filter: gridFilter,
      skip: gridPage.skip,
      take: gridPage.take,
    });
  }, [filteredRows, gridFilter, gridPage]);

  // Define columns for export
  const columns: ColumnDefinition[] = [
    { field: 'product', title: 'Product' },
    { field: 'retailer', title: 'Retailer' },
    { field: 'status', title: 'Status' },
    { field: 'lastSync', title: 'Last Sync' },
    { field: 'message', title: 'Message' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Syndication</h1>
        <p className="text-sm text-gray-600">
          Monitor and manage your product syndication across all connected
          retailers.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-gray-900">
            {mockStats.total}
          </div>
          <div className="text-sm text-gray-500">Total Syncs</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-green-600">
            {mockStats.success}
          </div>
          <div className="text-sm text-gray-500">Successful</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-red-600">
            {mockStats.failed}
          </div>
          <div className="text-sm text-gray-500">Failed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-amber-600">
            {mockStats.inProgress}
          </div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
      </div>

      {/* Filter/Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products or retailers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["All", "Success", "Failed", "In Progress"] as const).map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-md border ${
                filter === f ? "bg-gray-900 text-white" : "border-gray-300"
              } text-sm`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <ExportButton
            data={filteredRows}
            columns={columns}
            gridRef={gridRef}
            fileName="Syndication"
          />
        </div>
      </div>

      {/* Kendo Data Grid */}
      <div className="bg-white rounded-lg border border-gray-200 p-2">
        <Grid
          ref={gridRef}
          style={{ height: "500px", border: "none" }}
          data={processedData}
          filterable={true}
          pageable={true}
          sortable={true}
          filter={gridFilter}
          onFilterChange={(e: GridFilterChangeEvent) => setGridFilter(e.filter)}
          skip={gridPage.skip}
          take={gridPage.take}
          total={filteredRows.length}
          onPageChange={(e: GridPageChangeEvent) => setGridPage(e.page)}
          pager={MyPager}
          className="border-none"
        >
          <Column field="product" title="Product" />
          <Column field="retailer" title="Retailer" />
          <Column
            field="status"
            title="Status"
            cell={statusCell}
            filterable={false}
          />
          <Column field="lastSync" title="Last Sync" />
          <Column
            field="message"
            title="Message"
            cell={messageCell}
            filterable={false}
          />
        </Grid>
      </div>
    </div>
  );
}

export default Syndication;
