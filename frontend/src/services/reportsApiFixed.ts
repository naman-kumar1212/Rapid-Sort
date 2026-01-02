import { apiClient } from './api';
// Dynamic import for jsPDF to keep initial bundle smaller
let __jsPDFCache: any = null;
const getJsPDF = async () => {
  if (__jsPDFCache) return __jsPDFCache;
  const mod: any = await import('jspdf');
  __jsPDFCache = mod.jsPDF || mod.default || mod;
  return __jsPDFCache;
};

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  supplier?: string;
  status?: string;
  format?: 'json' | 'csv' | 'pdf';
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
}

export interface InventoryReport {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: Array<{
    categoryName: string;
    productCount: number;
    totalValue: number;
  }>;
}

export interface CustomerReport {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  topCustomers: Array<{
    customerName: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

export interface SupplierReport {
  totalSuppliers: number;
  activeSuppliers: number;
  topSuppliers: Array<{
    supplierName: string;
    totalProducts: number;
    totalValue: number;
  }>;
}

class ReportsApi {
  async getSalesReport(filters: ReportFilters = {}): Promise<{ success: boolean; data: SalesReport }> {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);

      const response = await apiClient.get(`/reports/sales?${params.toString()}`);

      if (response.data.success) {
        return response.data;
      }

      return {
        success: true,
        data: {
          period: 'No data',
          totalSales: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          topProducts: []
        }
      };
    } catch (error) {
      console.error('Sales report error:', error);
      throw error;
    }
  }

  async getInventoryReport(filters: ReportFilters = {}): Promise<{ success: boolean; data: InventoryReport }> {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.supplier) params.append('supplier', filters.supplier);

      const response = await apiClient.get(`/reports/inventory?${params.toString()}`);

      if (response.data.success) {
        return response.data;
      }

      return {
        success: true,
        data: {
          totalProducts: 0,
          totalValue: 0,
          lowStockItems: 0,
          outOfStockItems: 0,
          categories: []
        }
      };
    } catch (error) {
      console.error('Inventory report error:', error);
      throw error;
    }
  }

  async getCustomerReport(filters: ReportFilters = {}): Promise<{ success: boolean; data: CustomerReport }> {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);

      const response = await apiClient.get(`/reports/customers?${params.toString()}`);

      if (response.data.success) {
        return response.data;
      }

      return {
        success: true,
        data: {
          totalCustomers: 0,
          newCustomers: 0,
          repeatCustomers: 0,
          topCustomers: []
        }
      };
    } catch (error) {
      console.error('Customer report error:', error);
      throw error;
    }
  }

  async getSupplierReport(filters: ReportFilters = {}): Promise<{ success: boolean; data: SupplierReport }> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);

      const response = await apiClient.get(`/reports/suppliers?${params.toString()}`);

      if (response.data.success) {
        return response.data;
      }

      return {
        success: true,
        data: {
          totalSuppliers: 0,
          activeSuppliers: 0,
          topSuppliers: []
        }
      };
    } catch (error) {
      console.error('Supplier report error:', error);
      throw error;
    }
  }

  async exportReport(type: string, filters: ReportFilters = {}): Promise<Blob> {
    try {
      // For CSV export, use backend endpoint directly
      if (filters.format === 'csv') {
        const params = new URLSearchParams();
        params.append('format', 'csv');
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        if (filters.supplier) params.append('supplier', filters.supplier);

        const response = await apiClient.get(`/reports/${type}?${params.toString()}`, {
          responseType: 'blob'
        });

        return response.data;
      }

      // For PDF export, get report data and generate PDF
      let reportData;

      switch (type) {
        case 'sales':
          reportData = await this.getSalesReport(filters);
          break;
        case 'inventory':
          reportData = await this.getInventoryReport(filters);
          break;
        case 'customers':
          reportData = await this.getCustomerReport(filters);
          break;
        case 'suppliers':
          reportData = await this.getSupplierReport(filters);
          break;
        default:
          throw new Error('Invalid report type');
      }

      const currentDate = new Date().toLocaleDateString();

      // PDF export path
      if (filters.format === 'pdf') {
        const jsPDF = await getJsPDF();
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        let y = margin;

        const header = (title: string) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.text(title, margin, y);
          y += 20;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(`Generated on ${currentDate}`, margin, y);
          y += 12;
          doc.setDrawColor(200);
          doc.line(margin, y, pageWidth - margin, y);
          y += 16;
        };

        const ensureSpace = (needed = 18) => {
          if (y + needed > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
        };

        const keyVal = (k: string, v: string) => {
          ensureSpace();
          doc.setFont('helvetica', 'bold');
          doc.text(`${k}:`, margin, y);
          doc.setFont('helvetica', 'normal');
          doc.text(String(v), margin + 160, y);
          y += 16;
        };

        const table = (headers: string[], rows: (string | number)[][]) => {
          const colWidth = (pageWidth - margin * 2) / headers.length;
          const drawRow = (cells: (string | number)[], bold = false) => {
            ensureSpace(18);
            let x = margin;
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            cells.forEach((c) => {
              const text = String(c);
              const clipped = text.length > 60 ? text.slice(0, 57) + '...' : text;
              doc.text(clipped, x + 2, y);
              x += colWidth;
            });
            y += 18;
          };
          drawRow(headers, true);
          rows.forEach((r) => drawRow(r));
          y += 6;
        };

        // Simple horizontal bar chart helper
        const drawBarChart = (title: string, labels: string[], values: number[], options?: { color?: [number, number, number]; height?: number }) => {
          // Layout and sizing
          const maxBars = labels.length;
          const labelColWidth = 150;
          const rightPadding = 24;
          const availableWidth = pageWidth - margin * 2 - labelColWidth - rightPadding;
          const baseRowGap = 8;
          const baseBarHeight = 16;
          // Compute dynamic height to avoid cramped layout
          const chartHeight = options?.height || Math.max(160, maxBars * (baseBarHeight + baseRowGap) + 40);
          const color: [number, number, number] = options?.color || [16, 185, 129];
          const chartTopMargin = 22;
          const chartLeft = margin;
          const chartTop = y + chartTopMargin;

          // Page break if needed (title + chart + footer spacing)
          ensureSpace(chartHeight + chartTopMargin + 24);

          // Title
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          doc.text(title, chartLeft, y + 13);

          // Grid/ticks setup
          const maxVal = Math.max(1, ...values);
          const ticks = 5;
          const tickStep = maxVal / ticks;
          doc.setDrawColor(220);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          for (let i = 0; i <= ticks; i++) {
            const ratio = i / ticks;
            const x = chartLeft + labelColWidth + Math.round(availableWidth * ratio);
            // grid line
            doc.line(x, chartTop - 6, x, chartTop + chartHeight - 30);
            const tickVal = Math.round(tickStep * i);
            const label = tickVal.toLocaleString();
            doc.text(label, x - 8, chartTop + chartHeight - 12, { align: 'right' as any });
          }

          // Bars
          let currentY = chartTop;
          for (let idx = 0; idx < maxBars; idx++) {
            const label = labels[idx] ?? '';
            const v = values[idx] ?? 0;
            const ratio = v / maxVal;
            const barWidth = Math.max(0, Math.round(availableWidth * ratio));
            const barHeight = baseBarHeight;
            const rowGap = baseRowGap;

            // If next row would overflow, add a new page and redraw grid header
            if (currentY + barHeight > doc.internal.pageSize.getHeight() - margin) {
              doc.addPage();
              y = margin; // reset the shared cursor
              return drawBarChart(title, labels.slice(idx), values.slice(idx), options); // redraw remaining bars on new page
            }

            // Label text
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const clipped = label.length > 26 ? label.slice(0, 23) + '...' : label;
            doc.text(clipped, chartLeft, currentY + barHeight - 4);

            // Bar background (light)
            doc.setFillColor(245, 247, 250);
            doc.rect(chartLeft + labelColWidth, currentY, availableWidth, barHeight, 'F');

            // Bar fill
            doc.setFillColor(color[0], color[1], color[2]);
            doc.rect(chartLeft + labelColWidth, currentY, barWidth, barHeight, 'F');

            // Value label at end of bar
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            const valueText = v.toLocaleString();
            const valueX = chartLeft + labelColWidth + barWidth + 6;
            const valueY = currentY + barHeight - 4;
            doc.text(valueText, valueX, valueY);

            currentY += barHeight + rowGap;
          }

          // Advance global cursor with a comfortable gap below chart
          y = Math.max(y, currentY) + 10;
        };

        const titleMap: Record<string, string> = {
          sales: 'Sales Report',
          inventory: 'Inventory Report',
          customers: 'Customer Report',
          suppliers: 'Supplier Report',
        };
        header(titleMap[type] || 'Report');

        if (type === 'sales') {
          const data = reportData.data as SalesReport;
          keyVal('Period', data.period || 'N/A');
          keyVal('Total Sales', `$${(data.totalSales || 0).toLocaleString()}`);
          keyVal('Total Orders', String(data.totalOrders || 0));
          keyVal('Average Order Value', `$${(data.averageOrderValue || 0).toFixed(2)}`);
          if (data.topProducts?.length) {
            // Bar chart: Top Products by Quantity
            const top = (data.topProducts || []).slice(0, 8);
            drawBarChart(
              'Top Products by Quantity',
              top.map(p => p.productName || 'Unknown'),
              top.map(p => p.quantitySold || 0),
              { color: [59, 130, 246], height: 160 }
            );
            header('Top Products');
            table(
              ['Product', 'Quantity', 'Revenue'],
              data.topProducts.map((p) => [p.productName || 'Unknown', String(p.quantitySold || 0), `$${(p.revenue || 0).toFixed(2)}`])
            );
          }
        } else if (type === 'inventory') {
          const data = reportData.data as InventoryReport;
          keyVal('Total Products', String(data.totalProducts || 0));
          keyVal('Total Value', `$${(data.totalValue || 0).toLocaleString()}`);
          keyVal('Low Stock Items', String(data.lowStockItems || 0));
          keyVal('Out of Stock Items', String(data.outOfStockItems || 0));
          if (data.categories?.length) {
            // Bar chart: Products by Category
            const cats = (data.categories || []).slice(0, 10);
            drawBarChart(
              'Products by Category',
              cats.map(c => c.categoryName || 'Unknown'),
              cats.map(c => c.productCount || 0),
              { color: [34, 197, 94], height: 180 }
            );
            header('Categories');
            table(
              ['Category', 'Product Count', 'Total Value'],
              data.categories.map((c) => [c.categoryName || 'Unknown', String(c.productCount || 0), `$${(c.totalValue || 0).toFixed(2)}`])
            );
          }
        } else if (type === 'customers') {
          const data = reportData.data as CustomerReport;
          keyVal('Total Customers', String(data.totalCustomers || 0));
          keyVal('New Customers', String(data.newCustomers || 0));
          keyVal('Repeat Customers', String(data.repeatCustomers || 0));
          if (data.topCustomers?.length) {
            header('Top Customers');
            table(
              ['Customer', 'Total Orders', 'Total Spent'],
              data.topCustomers.map((c) => [c.customerName || 'Unknown', String(c.totalOrders || 0), `$${(c.totalSpent || 0).toFixed(2)}`])
            );
          }
        } else if (type === 'suppliers') {
          const data = reportData.data as SupplierReport;
          keyVal('Total Suppliers', String(data.totalSuppliers || 0));
          keyVal('Active Suppliers', String(data.activeSuppliers || 0));
          const rate = ((data.activeSuppliers || 0) / (data.totalSuppliers || 1)) * 100;
          keyVal('Performance Rate', `${rate.toFixed(1)}%`);
          if (data.topSuppliers?.length) {
            header('Top Suppliers');
            table(
              ['Supplier', 'Total Products', 'Total Value'],
              data.topSuppliers.map((s) => [s.supplierName || 'Unknown', String(s.totalProducts || 0), `$${(s.totalValue || 0).toFixed(2)}`])
            );
          }
        }

        // Return PDF Blob
        return doc.output('blob');
      }

      // CSV export path
      let csvContent = '';

      if (type === 'sales') {
        const salesData = reportData.data as SalesReport;
        csvContent = `Sales Report - Generated on ${currentDate}\n\n`;
        csvContent += `Summary\n`;
        csvContent += `Period,${salesData.period || 'N/A'}\n`;
        csvContent += `Total Sales,$${(salesData.totalSales || 0).toLocaleString()}\n`;
        csvContent += `Total Orders,${salesData.totalOrders || 0}\n`;
        csvContent += `Average Order Value,$${(salesData.averageOrderValue || 0).toFixed(2)}\n\n`;
        
        // Add top products if available
        if (salesData.topProducts && salesData.topProducts.length > 0) {
          csvContent += `Top Products\n`;
          csvContent += `Product Name,Quantity Sold,Revenue\n`;
          salesData.topProducts.forEach((product: any) => {
            csvContent += `"${product.productName || 'Unknown Product'}",${product.quantitySold || 0},$${(product.revenue || 0).toFixed(2)}\n`;
          });
        } else {
          csvContent += `Top Products\n`;
          csvContent += `No product data available\n`;
        }
        
      } else if (type === 'inventory') {
        const inventoryData = reportData.data as InventoryReport;
        csvContent = `Inventory Report - Generated on ${currentDate}\n\n`;
        csvContent += `Summary\n`;
        csvContent += `Total Products,${inventoryData.totalProducts || 0}\n`;
        csvContent += `Total Value,$${(inventoryData.totalValue || 0).toLocaleString()}\n`;
        csvContent += `Low Stock Items,${inventoryData.lowStockItems || 0}\n`;
        csvContent += `Out of Stock Items,${inventoryData.outOfStockItems || 0}\n\n`;
        
        // Add categories if available
        if (inventoryData.categories && inventoryData.categories.length > 0) {
          csvContent += `Categories\n`;
          csvContent += `Category,Product Count,Total Value\n`;
          inventoryData.categories.forEach((cat: any) => {
            csvContent += `"${cat.categoryName || 'Unknown'}",${cat.productCount || 0},$${(cat.totalValue || 0).toFixed(2)}\n`;
          });
        } else {
          csvContent += `Categories\n`;
          csvContent += `No category data available\n`;
        }
        
      } else if (type === 'customers') {
        const customerData = reportData.data as CustomerReport;
        csvContent = `Customer Report - Generated on ${currentDate}\n\n`;
        csvContent += `Summary\n`;
        csvContent += `Total Customers,${customerData.totalCustomers || 0}\n`;
        csvContent += `New Customers,${customerData.newCustomers || 0}\n`;
        csvContent += `Repeat Customers,${customerData.repeatCustomers || 0}\n\n`;
        
        // Add top customers if available
        if (customerData.topCustomers && customerData.topCustomers.length > 0) {
          csvContent += `Top Customers\n`;
          csvContent += `Customer Name,Total Orders,Total Spent\n`;
          customerData.topCustomers.forEach((customer: any) => {
            csvContent += `"${customer.customerName || 'Unknown Customer'}",${customer.totalOrders || 0},$${(customer.totalSpent || 0).toFixed(2)}\n`;
          });
        } else {
          csvContent += `Top Customers\n`;
          csvContent += `No customer data available\n`;
        }
        
      } else if (type === 'suppliers') {
        const supplierData = reportData.data as SupplierReport;
        csvContent = `Supplier Report - Generated on ${currentDate}\n\n`;
        csvContent += `Summary\n`;
        csvContent += `Total Suppliers,${supplierData.totalSuppliers || 0}\n`;
        csvContent += `Active Suppliers,${supplierData.activeSuppliers || 0}\n`;
        csvContent += `Performance Rate,${(((supplierData.activeSuppliers || 0) / (supplierData.totalSuppliers || 1)) * 100).toFixed(1)}%\n\n`;
        
        // Add top suppliers if available
        if (supplierData.topSuppliers && supplierData.topSuppliers.length > 0) {
          csvContent += `Top Suppliers\n`;
          csvContent += `Supplier Name,Total Products,Total Value\n`;
          supplierData.topSuppliers.forEach((supplier: any) => {
            csvContent += `"${supplier.supplierName || 'Unknown Supplier'}",${supplier.totalProducts || 0},$${(supplier.totalValue || 0).toFixed(2)}\n`;
          });
        } else {
          csvContent += `Top Suppliers\n`;
          csvContent += `No supplier data available\n`;
        }
      }

      // Ensure we have content
      if (!csvContent.trim()) {
        csvContent = `Report Export - Generated on ${currentDate}\n\nNo data available for the selected report type and filters.`;
      }

      // Create blob with proper encoding
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    } catch (error) {
      console.error('Export report error:', error);
      // Return a blob with error information instead of throwing
      const errorContent = `Export Error - Generated on ${new Date().toLocaleDateString()}\n\nFailed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`;
      return new Blob([errorContent], { type: 'text/csv;charset=utf-8;' });
    }
  }

  async getRevenueAnalytics(period: string = '12months'): Promise<{ success: boolean; data: any }> {
    try {
      // Use dashboard sales analytics endpoint
      const periodDays = this.convertPeriodToDays(period);
      const response = await apiClient.get(`/dashboard/sales?period=${periodDays}`);

      if (response.data.success) {
        // Transform the data to match expected format
        const salesData = response.data.data;
        return {
          success: true,
          data: {
            summary: salesData.summary,
            salesOverTime: salesData.salesOverTime,
            salesByStatus: salesData.salesByStatus,
            topCustomers: salesData.topCustomers,
            topRevenueSources: salesData.topCustomers?.map((customer: any) => ({
              name: customer.customerName || customer._id,
              revenue: customer.totalSpent
            })) || []
          }
        };
      }
      return response.data;
    } catch (error) {
      console.error('Revenue analytics error:', error);
      throw error;
    }
  }

  async getGrowthAnalytics(period: string = '12months'): Promise<{ success: boolean; data: any }> {
    try {
      // Use dashboard overview and sales analytics
      const periodDays = this.convertPeriodToDays(period);
      const [overviewResponse, salesResponse] = await Promise.all([
        apiClient.get('/dashboard/overview'),
        apiClient.get(`/dashboard/sales?period=${periodDays}`)
      ]);

      if (overviewResponse.data.success && salesResponse.data.success) {
        const overview = overviewResponse.data.data;
        const sales = salesResponse.data.data;

        // Calculate growth metrics from available data
        const currentRevenue = sales.summary?.totalRevenue || 0;
        const currentOrders = sales.summary?.totalOrders || 0;
        const currentProducts = overview.counts?.products || 0;

        // Previous period data would come from historical data
        const previousRevenue = 0; // No historical data available
        const previousOrders = 0; // No historical data available
        const previousProducts = 0; // No historical data available

        return {
          success: true,
          data: {
            revenueGrowth: {
              current: currentRevenue,
              rate: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0
            },
            orderGrowth: {
              current: currentOrders,
              rate: previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0
            },
            productGrowth: {
              current: currentProducts,
              rate: previousProducts > 0 ? ((currentProducts - previousProducts) / previousProducts) * 100 : 0
            },
            customerGrowth: {
              current: sales.topCustomers?.length || 0,
              rate: 0 // No historical data for growth calculation
            },
            monthlyActiveCustomers: {
              current: sales.topCustomers?.length || 0,
              previous: 0
            },
            averageOrderValue: {
              current: sales.summary?.avgValue || 0,
              previous: 0
            },
            customerRetention: {
              current: 0,
              previous: 0
            },
            conversionRate: {
              current: 0,
              previous: 0
            },
            insights: [],
            opportunities: []
          }
        };
      }

      return {
        success: false,
        data: null
      };
    } catch (error) {
      console.error('Growth analytics error:', error);
      throw error;
    }
  }

  private convertPeriodToDays(period: string): string {
    switch (period) {
      case '30days': return '30';
      case '90days': return '90';
      case '6months': return '180';
      case '12months': return '365';
      case '2years': return '730';
      default: return '365';
    }
  }
}

export const reportsApi = new ReportsApi();