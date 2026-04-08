import { Package, Tag, IndianRupee, Layers, FileText } from 'lucide-react';

const AccessoryDetails = ({ accessory }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Package className="w-8 h-8 text-hyundai-blue" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{accessory.name}</h3>
          <p className="text-sm text-gray-500">Code: {accessory.accessoryCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <Tag className="w-3 h-3 mr-1" /> Category
          </p>
          <p className="text-sm font-medium text-gray-900">{accessory.category || 'N/A'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <IndianRupee className="w-3 h-3 mr-1" /> Price
          </p>
          <p className="text-sm font-bold text-hyundai-blue">₹{accessory.price?.toLocaleString('en-IN')}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <Layers className="w-3 h-3 mr-1" /> Stock Quantity
          </p>
          <p className="text-sm font-medium text-gray-900">{accessory.stockQuantity} units</p>
        </div>
      </div>

      {accessory.description && (
        <div className="pt-4 border-t">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center mb-2">
            <FileText className="w-3 h-3 mr-1" /> Description
          </p>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {accessory.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default AccessoryDetails;
