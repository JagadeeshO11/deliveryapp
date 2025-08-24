import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapView({ start, end }) {
  return (
    <MapContainer center={start} zoom={13} style={{ height: '300px', marginTop: '20px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={start} />
      <Marker position={end} />
      <Polyline positions={[start, end]} color="blue" />
    </MapContainer>
  );
}

export default MapView;
