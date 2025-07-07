import { useRef } from 'react';
import { Printer, Download, X } from 'lucide-react';

const PrintCotizacion = ({ cotizacion, onClose }) => {
  const printRef = useRef();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Función para imprimir en una nueva ventana
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Cotización ${cotizacion.numero}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; color: #2563eb; }
            .quote-number { font-size: 18px; color: #666; margin-top: 10px; }
            .client-info { margin-bottom: 30px; }
            .client-info h3 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .materials-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .materials-table th, .materials-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .materials-table th { background-color: #f8f9fa; font-weight: bold; }
            .services { margin: 20px 0; }
            .total { font-size: 18px; font-weight: bold; text-align: right; border-top: 2px solid #333; padding-top: 10px; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Descargar como PDF (puede ser igual a imprimir, pero se deja por si se quiere personalizar)
  const handleDownload = () => {
    handlePrint();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header con botones */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Cotización {cotizacion.numero}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="btn-primary flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Descargar</span>
            </button>
            <button
              onClick={onClose}
              className="btn-danger flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cerrar</span>
            </button>
          </div>
        </div>

        {/* Contenido de la cotización */}
        <div ref={printRef} className="p-6">
          {/* Header de la empresa */}
          <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
            <div className="text-3xl font-bold text-blue-600 mb-2">NoasArt</div>
            <div className="text-lg text-gray-600 mb-2">Sistema de Cotizaciones</div>
            <div className="text-sm text-gray-500">
              Especialistas en Construcción y Remodelación
            </div>
            <div className="text-xl font-semibold text-gray-800 mt-4">
              COTIZACIÓN {cotizacion.numero}
            </div>
          </div>

          {/* Información del cliente */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Cliente:</p>
                <p className="text-lg font-medium text-gray-900">{cotizacion.cliente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha:</p>
                <p className="text-lg font-medium text-gray-900">{formatDate(cotizacion.createdAt)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Proyecto:</p>
                <p className="text-lg font-medium text-gray-900">{cotizacion.proyecto}</p>
              </div>
            </div>
          </div>

          {/* Materiales */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Materiales
            </h3>
            {cotizacion.items && cotizacion.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Material</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Cantidad</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Precio Unitario</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotizacion.items.map((item, index) => {
                      const materialNombre = item.material?.nombre || `Material ${item.material}`;
                      const materialUnidad = item.material?.unidad || 'unidad';
                      const subtotal = item.subtotal || (item.precioUnitario * item.cantidad);
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">
                            {materialNombre}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {item.cantidad} {materialUnidad}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {formatCurrency(item.precioUnitario)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-medium">
                            {formatCurrency(subtotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay materiales en esta cotización</p>
            )}
          </div>

          {/* Servicios */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Servicios
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="font-medium">Mano de Obra</span>
                  <span className="text-gray-600 ml-2">
                    ({cotizacion.manoObra?.horas || 0} horas × {formatCurrency(cotizacion.manoObra?.precioPorHora || 0)}/hora)
                  </span>
                </div>
                <span className="font-semibold">
                  {formatCurrency(cotizacion.manoObra?.total || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="font-medium">Pintura</span>
                  <span className="text-gray-600 ml-2">
                    ({cotizacion.pintura?.metrosCuadrados || 0} m² × {formatCurrency(cotizacion.pintura?.precioPorMetro || 0)}/m²)
                  </span>
                </div>
                <span className="font-semibold">
                  {formatCurrency(cotizacion.pintura?.total || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Notas */}
          {cotizacion.notas && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Notas Adicionales
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{cotizacion.notas}</p>
              </div>
            </div>
          )}

          {/* Totales */}
          <div className="border-t-2 border-gray-300 pt-6">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Subtotal Materiales:</span>
              <span>{formatCurrency(cotizacion.subtotalMateriales || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold mt-2">
              <span>Total Servicios:</span>
              <span>
                {formatCurrency((cotizacion.manoObra?.total || 0) + (cotizacion.pintura?.total || 0))}
              </span>
            </div>
            <div className="flex justify-between items-center text-2xl font-bold mt-4 pt-4 border-t-2 border-gray-300">
              <span>TOTAL:</span>
              <span>{formatCurrency(cotizacion.total)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-600 text-sm">
            <p className="mb-2">
              <strong>NoasArt</strong> - Especialistas en Construcción y Remodelación
            </p>
            <p className="mb-2">
              Esta cotización es válida por 30 días desde la fecha de emisión
            </p>
            <p>
              Para cualquier consulta, contáctenos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintCotizacion; 