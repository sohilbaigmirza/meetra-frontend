import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Default coordinates for Gwalior / Campus hotspots
const DEFAULT_ORIGIN = [26.2183, 78.1828]; // MITS / University Rd area
const DEFAULT_DEST = [26.2045, 78.1945];   // City Center hotspot

export default function RouteMap({ startCoords = DEFAULT_ORIGIN, destCoords = DEFAULT_DEST, destTitle = "Destination" }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [routeInfo, setRouteInfo] = React.useState({ distanceKm: 0, durationMin: 0 });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not already initialized
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(startCoords, 13);

      // OpenStreetMap Free Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear previous vector layers / markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add Start Marker (Blue)
    L.marker(startCoords).addTo(map).bindPopup("<b>Pickup:</b> Your Location").openPopup();

    // Add Destination Marker (Red Accent)
    L.marker(destCoords).addTo(map).bindPopup(`<b>Destination:</b> ${destTitle}`);

    // Call Free OSRM Public Routing API to get real street path
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);

          // Draw the route on the map
          const polyline = L.polyline(coords, {
            color: '#FF6B6B',
            weight: 5,
            opacity: 0.85,
            lineJoin: 'round'
          }).addTo(map);

          map.fitBounds(polyline.getBounds(), { padding: [30, 30] });

          setRouteInfo({
            distanceKm: (route.distance / 1000).toFixed(1),
            durationMin: Math.round(route.duration / 60)
          });
        }
      })
      .catch(err => {
        console.error("OSRM Route Error, falling back to straight line:", err);
        const fallback = L.polyline([startCoords, destCoords], { color: '#4D96FF', weight: 4, dashArray: '5, 8' }).addTo(map);
        map.fitBounds(fallback.getBounds(), { padding: [30, 30] });
      });

  }, [startCoords, destCoords, destTitle]);

  return (
    <div className="space-y-2">
      <div 
        ref={mapContainerRef} 
        className="w-full h-44 rounded-xl border-2 border-slate-900 overflow-hidden shadow-[2px_2px_0px_#000] z-0"
      />
      {routeInfo.distanceKm > 0 && (
        <div className="flex justify-between items-center bg-amber-50 border-2 border-slate-900 rounded-xl px-3 py-1.5 text-xs font-black">
          <span className="text-slate-700">📍 Road Distance: <span className="text-[#FF6B6B]">{routeInfo.distanceKm} km</span></span>
          <span className="text-slate-700">⏱ Est. Travel: <span className="text-emerald-700">~{routeInfo.durationMin} mins</span></span>
        </div>
      )}
    </div>
  );
}