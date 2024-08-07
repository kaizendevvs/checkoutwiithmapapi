import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { TextField } from '@shopify/polaris';
import axios from 'axios';

const libraries = ['places'];
const mapContainerStyle = {
  height: '400px',
  width: '100%',
};
const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

function Checkout() {
  const [address, setAddress] = useState('');
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const mapRef = useRef();

  const handleAddressChange = async (value) => {
    setAddress(value);
    // Lógica para actualizar el mapa basada en la dirección ingresada
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyDwew5gKOg1i3dLAc5B2dzrNxy_36eunSI`;
    const response = await axios.get(geocodeUrl);
    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      setMarkerPosition({ lat: location.lat, lng: location.lng });
      if (mapRef.current) {
        mapRef.current.panTo({ lat: location.lat, lng: location.lng });
      }
    }
  };

  const handleMarkerDragEnd = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    // Lógica para actualizar el campo de dirección basado en la posición del marcador
    const reverseGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDwew5gKOg1i3dLAc5B2dzrNxy_36eunSI`;
    const response = await axios.get(reverseGeocodeUrl);
    if (response.data.results.length > 0) {
      setAddress(response.data.results[0].formatted_address);
    }
  };

  return (
    <div>
      <TextField
        label="Shipping Address"
        value={address}
        onChange={(value) => handleAddressChange(value)}
      />
      <LoadScript googleMapsApiKey="AIzaSyDwew5gKOg1i3dLAc5B2dzrNxy_36eunSI" libraries={libraries}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition}
          zoom={10}
          onLoad={(map) => (mapRef.current = map)}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Checkout;