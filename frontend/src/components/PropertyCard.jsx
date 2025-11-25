import React from 'react';
import { Card } from './ui/card';
import * as Icons from 'lucide-react';

const PropertyCard = ({ property }) => {
  const getIcon = (iconName) => {
    const Icon = Icons[iconName] || Icons.Home;
    return <Icon size={18} />;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badge */}
        {property.badge && (
          <div
            className="absolute top-3 left-3 px-3 py-1 text-white text-sm font-medium"
            style={{ backgroundColor: '#00537C' }}
          >
            {property.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1" style={{ color: '#00537C' }}>
          {property.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{property.location}</p>
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          {property.description}
        </p>

        {/* Amenities */}
        <div className="grid grid-cols-2 gap-3">
          {property.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
              <div style={{ color: '#00537C' }}>
                {getIcon(amenity.icon)}
              </div>
              <span>{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
