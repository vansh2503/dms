import { useState, useMemo } from 'react';
import { MapPin, Car } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';

const StockyardMapView = ({ vehicles }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Group vehicles by stockyard location
  const groupedVehicles = useMemo(() => {
    const groups = {};
    vehicles.forEach(vehicle => {
      const location = vehicle.stockyardLocation || 'Unassigned';
      if (!groups[location]) {
        groups[location] = [];
      }
      groups[location].push(vehicle);
    });
    return groups;
  }, [vehicles]);

  const locations = Object.keys(groupedVehicles).sort();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Stockyard Map View</h2>
        <p className="text-gray-600">
          Vehicles grouped by physical location in the stockyard
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Locations</p>
              <p className="text-2xl font-bold text-blue-900">{locations.length}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Vehicles</p>
              <p className="text-2xl font-bold text-green-900">{vehicles.length}</p>
            </div>
            <Car className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg per Location</p>
              <p className="text-2xl font-bold text-purple-900">
                {locations.length > 0 ? Math.round(vehicles.length / locations.length) : 0}
              </p>
            </div>
            <Car className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Unassigned</p>
              <p className="text-2xl font-bold text-orange-900">
                {groupedVehicles['Unassigned']?.length || 0}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {locations.map(location => {
          const vehiclesInLocation = groupedVehicles[location];
          const isSelected = selectedLocation === location;

          return (
            <div
              key={location}
              onClick={() => setSelectedLocation(isSelected ? null : location)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-hyundai-blue bg-blue-50 shadow-lg' 
                  : 'border-gray-200 hover:border-hyundai-lightblue hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <MapPin className={`w-5 h-5 mr-2 ${isSelected ? 'text-hyundai-blue' : 'text-gray-500'}`} />
                  <h3 className="font-semibold text-gray-800">{location}</h3>
                </div>
                <span className="bg-hyundai-blue text-white text-xs font-bold px-2 py-1 rounded-full">
                  {vehiclesInLocation.length}
                </span>
              </div>

              {/* Vehicle List */}
              <div className="space-y-2">
                {vehiclesInLocation.slice(0, isSelected ? vehiclesInLocation.length : 3).map(vehicle => (
                  <div
                    key={vehicle.id}
                    className="bg-white rounded p-2 text-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{vehicle.model}</p>
                        <p className="text-xs text-gray-600">{vehicle.variant}</p>
                        <p className="text-xs text-gray-500 mt-1">VIN: {vehicle.vin}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status?.replace('_', ' ').substring(0, 10)}
                      </span>
                    </div>
                  </div>
                ))}

                {!isSelected && vehiclesInLocation.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{vehiclesInLocation.length - 3} more vehicles
                  </p>
                )}
              </div>

              {/* Status Summary */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(
                    vehiclesInLocation.reduce((acc, v) => {
                      acc[v.status] = (acc[v.status] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([status, count]) => (
                    <span
                      key={status}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {status.replace('_', ' ')}: {count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {locations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No vehicles in stockyard</p>
        </div>
      )}
    </div>
  );
};

export default StockyardMapView;
