import { Car, Fuel, Settings, Users, Shield, Zap, Info } from 'lucide-react';

const VariantDetails = ({ variant }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Car className="w-8 h-8 text-hyundai-blue" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{variant.model} - {variant.variantName}</h3>
          <p className="text-sm text-gray-500">Code: {variant.variantCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <Fuel className="w-3 h-3 mr-1" /> Fuel Type
          </p>
          <p className="text-sm font-medium text-gray-900">{variant.fuelType}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <Settings className="w-3 h-3 mr-1" /> Transmission
          </p>
          <p className="text-sm font-medium text-gray-900">{variant.transmission}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <Zap className="w-3 h-3 mr-1" /> Engine
          </p>
          <p className="text-sm font-medium text-gray-900">{variant.engineCC ? `${variant.engineCC}cc` : 'N/A'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <Users className="w-3 h-3 mr-1" /> Seating
          </p>
          <p className="text-sm font-medium text-gray-900">{variant.seatingCapacity} Seater</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <Shield className="w-3 h-3 mr-1" /> Airbags
          </p>
          <p className="text-sm font-medium text-gray-900">{variant.airbags || 0}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            Pricing
          </p>
          <p className="text-sm font-bold text-hyundai-blue">₹{variant.exShowroomPrice?.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {(variant.features) && (
        <div className="pt-4 border-t">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center mb-2">
            <Info className="w-3 h-3 mr-1" /> Key Features
          </p>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {variant.features}
          </p>
        </div>
      )}
    </div>
  );
};

export default VariantDetails;
