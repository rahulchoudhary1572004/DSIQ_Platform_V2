import React, { useState, useRef } from "react";
import type { ReactNode, RefObject, ChangeEvent } from "react";
import { CSVLink } from "react-csv";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { PDFExport } from "@progress/kendo-react-pdf";
import { process } from "@progress/kendo-data-query";

// Type Definitions
interface CustomButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'export';
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  [key: string]: any;
}

interface CustomDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

interface DropdownItemProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

interface DropdownLabelProps {
  children: ReactNode;
}

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

interface CustomRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  name: string;
}

interface CustomRadioItemProps {
  value: string;
  children: ReactNode;
  name: string;
  selectedValue?: string;
  onChange?: (value: string) => void;
}

interface GroupItem {
  field: string;
  value: string;
  items?: GroupItem[];
  aggregates?: Record<string, any>;
}

interface Column {
  field: string;
  title?: string;
  [key: string]: any;
}

interface ExportOptions {
  type: 'excel' | 'csv' | 'pdf';
  scope: 'current' | 'all';
  aggregates: Aggregate[];
}

interface Aggregate {
  field: string;
  aggregate: 'sum' | 'average' | 'count';
}

interface PageState {
  skip: number;
  take: number;
  group?: string[];
  [key: string]: any;
}

interface ProcessedDataResult {
  data: any[];
}

interface CSVDataItem {
  [key: string]: any;
}

interface PDFDataState {
  data: any[];
  columns: Column[];
}

interface ExportUtilsProps {
  enableExport: boolean;
  columns: Column[];
  processedData: ProcessedDataResult | null;
  currentData: any[];
  sort: any[];
  page: PageState;
  aggregates?: Aggregate[];
  onExport?: (options: ExportOptions) => void;
}

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  totalPages: number;
  currentPage: number;
  aggregates: Aggregate[];
}

interface ExportIconProps {
  className?: string;
}

// Enhanced Custom Button Component
const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  variant = "default",
  className = "",
  disabled = false,
  size = "default",
  ...props
}) => {
  const baseClasses: string = "relative inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 disabled:transform-none select-none";
  const sizeClasses: Record<string, string> = {
    sm: "px-2 py-1 text-xs rounded-md",
    default: "px-3 py-1.5 text-sm rounded-md",
    lg: "px-4 py-2 text-base rounded-md",
  };
  const variantClasses: Record<string, string> = {
    default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow hover:shadow-md",
    outline: "border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 focus:ring-blue-500 shadow-sm",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-500 shadow-sm",
    export: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-500 shadow hover:shadow-md border-0",
  };
  const disabledClasses: string = disabled ? "opacity-50 cursor-not-allowed hover:shadow-none" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Compact Export Icon Component
const ExportIcon: React.FC<ExportIconProps> = ({ className = "" }) => (
  <svg
    className={`w-3.5 h-3.5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Compact Dropdown Component
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  trigger,
  children,
  isOpen,
  onToggle,
}) => (
  <div className="relative inline-block text-left">
    <div onClick={onToggle}>{trigger}</div>
    {isOpen && (
      <>
        <div
          className="fixed inset-0 z-5"
          style={{ backgroundColor: "rgba(60, 61, 61, 0.5)" }}
          onClick={onToggle}
        ></div>
        <div className="absolute right-0 z-20 mt-1 w-56 origin-top-right rounded-lg bg-white/95 backdrop-blur-lg shadow-lg ring-1 ring-black/5 border border-white/20">
          <div className="py-1">{children}</div>
        </div>
      </>
    )}
  </div>
);

// Dropdown Item Component
const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`group flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-900 ${className}`}
  >
    {children}
  </button>
);

// Dropdown Label Component
const DropdownLabel: React.FC<DropdownLabelProps> = ({ children }) => (
  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
    {children}
  </div>
);

// Dropdown Separator Component
const DropdownSeparator: React.FC = () => (
  <div className="border-t border-gray-100 my-0.5 mx-1"></div>
);

// Compact Modal Component
const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
        <div className="fixed inset-0 bg-black/30" onClick={onClose}></div>
        <div className="relative bg-white/95 backdrop-blur-lg rounded-lg shadow-lg max-w-sm sm:max-w-md w-full border border-white/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="px-4 py-4">{children}</div>
          {footer && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact Radio Group Component
const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  value,
  onChange,
  children,
  name,
}) => (
  <div className="space-y-2">
    {React.Children.map(children, (child: ReactNode, index: number) =>
      React.isValidElement(child)
        ? React.cloneElement(child, {
            name,
            selectedValue: value,
            onChange,
            key: index,
          } as any)
        : child
    )}
  </div>
);

// Custom Radio Item Component
const CustomRadioItem: React.FC<CustomRadioItemProps> = ({
  value,
  children,
  name,
  selectedValue,
  onChange,
}) => (
  <div className="flex items-center p-2 rounded-md border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer">
    <input
      type="radio"
      id={`${name}-${value}`}
      name={name}
      value={value}
      checked={selectedValue === value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
      className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300"
    />
    <label
      htmlFor={`${name}-${value}`}
      className="ml-2 text-xs text-gray-700 cursor-pointer font-medium"
    >
      {children}
    </label>
  </div>
);

// Helper function to flatten grouped data for export
const flattenGroupedData = (
  data: any[],
  groupFields: string[],
  aggregates: Aggregate[] = [],
  level: number = 0
): any[] => {
  const result: any[] = [];

  data.forEach((item: any) => {
    if (item.items) {
      // Group header
      result.push({
        __group: true,
        level,
        profileName: `${"  ".repeat(level)}${item.field}: ${item.value}`,
        ...Object.fromEntries(aggregates.map((agg: Aggregate) => [agg.field, ""])),
      });

      // Process detail rows first
      result.push(...flattenGroupedData(item.items, groupFields, aggregates, level + 1));

      // Add aggregate row after detail rows
      if (item.aggregates && aggregates.length > 0) {
        const aggRow: any = {
          __group: true,
          level: level + 1,
          profileName: `${"  ".repeat(level + 1)}Aggregates`,
        };

        aggregates.forEach((agg: Aggregate) => {
          if (item.aggregates[agg.field] && agg.aggregate === "sum") {
            aggRow[agg.field] = `Sum: ${item.aggregates[agg.field].sum.toLocaleString()}`;
          } else if (item.aggregates[agg.field] && agg.aggregate === "average") {
            aggRow[agg.field] = `Avg: ${item.aggregates[agg.field].average.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          }
        });

        result.push(aggRow);
      }
    } else {
      // Data row
      const row: any = { ...item };
      if (level > 0) {
        row.profileName = `${"  ".repeat(level)}${row.profileName || ""}`;
      }
      result.push(row);
    }
  });

  return result;
};

// Export utility functions
const prepareExcelData = (
  data: any[],
  columns: Column[],
  group: string[],
  aggregates: Aggregate[] = []
): any[] => {
  try {
    let exportData: any[] = [...data];

    if (group && group.length > 0) {
      const processedData: ProcessedDataResult = process(data, { group });
      exportData = flattenGroupedData(processedData.data, group, aggregates);
    }

    return exportData.map((item: any) => {
      const row: any = {};

      columns
        .filter((col: Column) => col.field && col.field !== "")
        .forEach((col: Column) => {
          row[col.field] = item.__group
            ? col.field === "profileName"
              ? item.profileName || ""
              : item[col.field] || ""
            : item[col.field] !== undefined && item[col.field] !== null
            ? String(item[col.field]).replace(/[^\x00-\x7F]/g, "")
            : "";
        });

      return row;
    });
  } catch (error) {
    console.error("Error preparing Excel data:", error);
    return [];
  }
};

interface CSVDataResult {
  headers: Array<{ label: string; key: string }>;
  processedData: CSVDataItem[];
}

const prepareCSVData = (
  data: any[],
  columns: Column[],
  group: string[],
  aggregates: Aggregate[] = []
): CSVDataResult => {
  try {
    const headers: Array<{ label: string; key: string }> = columns
      .filter((col: Column) => col.field && col.field !== "")
      .map((col: Column) => ({ label: col.title || col.field, key: col.field }));

    let exportData: any[] = [...data];

    if (group && group.length > 0) {
      const processedData: ProcessedDataResult = process(data, { group });
      exportData = flattenGroupedData(processedData.data, group, aggregates);
    }

    const processedData: CSVDataItem[] = exportData.map((item: any) => {
      const row: any = {};

      columns
        .filter((col: Column) => col.field && col.field !== "")
        .forEach((col: Column) => {
          row[col.field] = item.__group
            ? col.field === "profileName"
              ? item.profileName || ""
              : item[col.field] || ""
            : item[col.field] !== undefined && item[col.field] !== null
            ? String(item[col.field]).replace(/[^\x00-\x7F]/g, "")
            : "";
        });

      return row;
    });

    return { headers, processedData };
  } catch (error) {
    console.error("Error preparing CSV data:", error);
    return { headers: [], processedData: [] };
  }
};

// Export Options Dialog Component
const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  totalPages,
  currentPage,
  aggregates,
}) => {
  const [exportType, setExportType] = useState<'excel' | 'csv' | 'pdf'>("excel");
  const [exportScope, setExportScope] = useState<'current' | 'all'>("current");

  const handleExport = (): void => {
    onExport({ type: exportType, scope: exportScope, aggregates });
    onClose();
  };

  const footer: ReactNode = (
    <>
      <CustomButton variant="outline" onClick={onClose} className="px-3 py-1">
        Cancel
      </CustomButton>
      <CustomButton onClick={handleExport} className="px-3 py-1">
        Export
      </CustomButton>
    </>
  );

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Export Data" footer={footer}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Export Format</label>
          <CustomRadioGroup value={exportType} onChange={setExportType} name="exportType">
            <CustomRadioItem value="excel">
              <span className="flex items-center gap-2">
                <span className="text-green-600 text-base">📊</span>Excel (.xlsx)
              </span>
            </CustomRadioItem>
            <CustomRadioItem value="csv">
              <span className="flex items-center gap-2">
                <span className="text-blue-600 text-base">📄</span>CSV (.csv)
              </span>
            </CustomRadioItem>
            <CustomRadioItem value="pdf">
              <span className="flex items-center gap-2">
                <span className="text-red-600 text-base">📋</span>PDF (.pdf)
              </span>
            </CustomRadioItem>
          </CustomRadioGroup>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Export Scope</label>
          <CustomRadioGroup value={exportScope} onChange={setExportScope} name="exportScope">
            <CustomRadioItem value="current">
              <span className="flex items-center gap-2">
                <span className="text-blue-600 text-base">📄</span>Current page (Page {currentPage})
              </span>
            </CustomRadioItem>
            <CustomRadioItem value="all">
              <span className="flex items-center gap-2">
                <span className="text-purple-600 text-base">📚</span>All pages ({totalPages} pages)
              </span>
            </CustomRadioItem>
          </CustomRadioGroup>
        </div>
      </div>
    </CustomModal>
  );
};

// Enhanced Export Component
const ExportUtils: React.FC<ExportUtilsProps> = ({
  enableExport,
  columns,
  processedData,
  currentData,
  sort,
  page,
  aggregates = [],
  onExport,
}) => {
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<CSVDataItem[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<Array<{ label: string; key: string }>>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [pdfData, setPdfData] = useState<PDFDataState | null>(null);

  const csvLinkRef: RefObject<any> = useRef<any>(null);
  const excelExportRef: RefObject<any> = useRef<any>(null);
  const pdfExportRef: RefObject<any> = useRef<any>(null);

  const getExportData = (exportOptions: ExportOptions): any[] => {
    try {
      const { scope } = exportOptions;
      let exportData: any[] = [];

      if (scope === "current") {
        exportData = processedData?.data || [];
      } else if (scope === "all") {
        exportData = [...(currentData || [])];

        if (sort && sort.length > 0) {
          exportData.sort((a: any, b: any) => {
            const valueA: any = a[sort[0].field];
            const valueB: any = b[sort[0].field];
            return sort[0].dir === "asc"
              ? valueA > valueB
                ? 1
                : -1
              : valueA < valueB
              ? 1
              : -1;
          });
        }
      }

      console.log("Export Data:", exportData);
      return exportData;
    } catch (error) {
      console.error("Error getting export data:", error);
      return [];
    }
  };

  const handleExport = (exportOptions: ExportOptions): void => {
    const { type, scope, aggregates: exportAggregates } = exportOptions;
    const exportData: any[] = getExportData(exportOptions);
    const fileName: string = `grid-export-${new Date().toISOString().split("T")[0]}`;
    const group: string[] = page.group || [];

    if (exportData.length === 0) {
      console.warn("No data available for export");
      return;
    }

    if (type === "excel") {
      const processedData: any[] = prepareExcelData(exportData, columns, group, exportAggregates);
      setExcelData(processedData);

      setTimeout(() => {
        if (excelExportRef.current && processedData.length > 0) {
          console.log("Triggering Excel Export with data:", processedData);
          excelExportRef.current.save();
        } else {
          console.warn("Excel export failed: No data or ref not ready");
        }
      }, 100);
    } else if (type === "csv") {
      const { headers, processedData: csvProcessedData }: CSVDataResult = prepareCSVData(
        exportData,
        columns,
        group,
        exportAggregates
      );
      setCsvHeaders(headers);
      setCsvData(csvProcessedData);

      setTimeout(() => {
        if (csvLinkRef.current && csvProcessedData.length > 0) {
          console.log("Triggering CSV Export with data:", csvProcessedData);
          csvLinkRef.current.link.click();
        } else {
          console.warn("CSV export failed: No data or ref not ready");
        }
      }, 100);
    } else if (type === "pdf") {
      const processedData: any[] =
        group && group.length > 0
          ? flattenGroupedData(process(exportData, { group }).data, group, exportAggregates)
          : [...exportData];

      console.log("Flattened Data for PDF:", processedData);
      setPdfData({ data: processedData, columns });

      setTimeout(() => {
        if (pdfExportRef.current && processedData.length > 0) {
          console.log("Triggering PDF Export with data:", processedData);
          pdfExportRef.current.save();
        } else {
          console.warn("PDF export failed: No data or ref not ready");
        }
      }, 100);
    }

    if (onExport) {
      onExport(exportOptions);
    }
  };

  const currentPage: number = Math.floor(page.skip / page.take) + 1;
  const totalPages: number = Math.ceil((currentData?.length || 0) / page.take) || 1;

  if (!enableExport) return null;

  return (
    <>
      <div className="mb-1 mt-1 mr-1 flex justify-end">
        <CustomDropdown
          isOpen={dropdownOpen}
          onToggle={() => setDropdownOpen(!dropdownOpen)}
          trigger={
            <CustomButton
              variant="export"
              className="gap-1 !px-1 !py-1.5 font-semibold text-sm tracking-tight hover:scale-105 sm:px-4 sm:py-2"
              size="sm"
            >
              <ExportIcon className="transition-transform duration-150 group-hover:scale-110" />
              <span className="hidden sm:inline">Export Data</span>
              <span className="sm:hidden">Export</span>
              <svg
                className="w-3.5 h-3.5 ml-0.5 transition-transform duration-150"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </CustomButton>
          }
        >
          <DropdownLabel>Quick Export</DropdownLabel>
          <DropdownItem
            onClick={() => {
              handleExport({ type: "excel", scope: "current", aggregates });
              setDropdownOpen(false);
            }}
          >
            <span className="flex items-center gap-2 w-full">
              <span className="text-green-600 text-base">📊</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">Excel</span>
                <span className="text-xs text-gray-500">Current Page</span>
              </div>
            </span>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              handleExport({ type: "csv", scope: "current", aggregates });
              setDropdownOpen(false);
            }}
          >
            <span className="flex items-center gap-2 w-full">
              <span className="text-blue-600 text-base">📄</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">CSV</span>
                <span className="text-xs text-gray-500">Current Page</span>
              </div>
            </span>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              handleExport({ type: "pdf", scope: "current", aggregates });
              setDropdownOpen(false);
            }}
          >
            <span className="flex items-center gap-2 w-full">
              <span className="text-red-600 text-base">📋</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">PDF</span>
                <span className="text-xs text-gray-500">Current Page</span>
              </div>
            </span>
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            onClick={() => {
              setExportDialogOpen(true);
              setDropdownOpen(false);
            }}
          >
            <span className="flex items-center gap-2 w-full">
              <span className="text-purple-600 text-base">⚙️</span>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">More Options</span>
                <span className="text-xs text-gray-500">Advanced settings</span>
              </div>
            </span>
          </DropdownItem>
        </CustomDropdown>
      </div>

      <ExportDialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExport}
        totalPages={totalPages}
        currentPage={currentPage}
        aggregates={aggregates}
      />

      {csvHeaders.length > 0 && csvData.length > 0 && (
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename={`grid-export-${new Date().toISOString().split("T")[0]}.csv`}
          className="hidden"
          ref={csvLinkRef}
        />
      )}

      {excelData.length > 0 && (
        <ExcelExport
          data={excelData}
          fileName={`grid-export-${new Date().toISOString().split("T")[0]}.xlsx`}
          ref={excelExportRef}
        >
          {columns
            .filter((col: Column) => col.field && col.field !== "")
            .map((col: Column, index: number) => (
              <ExcelExportColumn
                key={index}
                field={col.field}
                title={col.title || col.field}
              />
            ))}
        </ExcelExport>
      )}

      {pdfData && (
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <PDFExport
            ref={pdfExportRef}
            paperSize="auto"
            landscape={true}
            fileName={`grid-export-${new Date().toISOString().split("T")[0]}.pdf`}
            scale={0.9}
            margin={{ top: "0.8cm", bottom: "0.8cm", left: "0.8cm", right: "0.8cm" }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Arial, sans-serif",
                fontSize: "10px",
              }}
            >
              <thead>
                <tr>
                  {pdfData.columns
                    .filter((col: Column) => col.field && col.field !== "")
                    .map((col: Column, idx: number) => (
                      <th
                        key={idx}
                        style={{
                          border: "1px solid #ccc",
                          padding: "4px 6px",
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {col.title || col.field}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {pdfData.data.map((row: any, rowIdx: number) => (
                  <tr
                    key={rowIdx}
                    style={row.__group ? { backgroundColor: "#e0e0e0", fontWeight: "bold" } : {}}
                  >
                    {pdfData.columns
                      .filter((col: Column) => col.field && col.field !== "")
                      .map((col: Column, colIdx: number) => (
                        <td
                          key={colIdx}
                          style={{
                            border: "1px solid #eee",
                            padding: "4px 6px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textAlign:
                              row.__group &&
                              col.field !== "profileName" &&
                              row[col.field]
                                ? "right"
                                : "left",
                          }}
                        >
                          {row[col.field] !== undefined && row[col.field] !== null
                            ? String(row[col.field]).replace(/[^\x00-\x7F]/g, "")
                            : ""}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </PDFExport>
        </div>
      )}
    </>
  );
};

export default ExportUtils;
