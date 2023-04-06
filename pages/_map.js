import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import styles from '../styles/Home.module.css';
import { fetchData, getLatLongFromZipcode } from './_data'

const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID);

export default function Map() {
  const [rows, setRows] = useState([]);
  const [markers, setMarkers] = useState([]);
  const centerPosition = [39.8283, -98.5795];

  const renderMarker = (markerObj) => (
    <Marker position={markerObj.position} icon={markerObj.icon} key={markerObj.key}>
      <Popup>{markerObj.message}</Popup>
    </Marker>
  );

  useEffect(() => {
    async function fetchRows() {
      const rows = await fetchData();
      setRows(rows);
    }
    fetchRows();
  }, []);

  useEffect(() => {
    console.log('Processing rows...');
    const newMarkers = [];

    async function processRows() {
      for (const row of rows) {
        const { 'Country': country, 'Zipcode': zipcode, 'Full name': fullName } = row;
        if (!country || !zipcode || !fullName) {
          continue;
        }

        const position = await getLatLongFromZipcode(zipcode);
        const str = country.replace(/\s+/g, '-').toLowerCase();
        const flagURL = `/flags/${str}.png`;

        const decoratedRow = {
          message: `This is where ${fullName} lives. Their family is from ${country}.`,
          position,
          icon: L.icon({ iconUrl: flagURL, className: styles.marker }),
          key: `${fullName}-${zipcode}-${country}`,
        };
        newMarkers.push(decoratedRow);
      }
      setMarkers(newMarkers);
    }
    if (rows.length > 0 && markers.length === 0) {
      processRows();
    }
  }, [rows, markers.length]);

  return (
    <div>
      <MapContainer center={centerPosition} zoom={4} scrollWheelZoom={false} style={{ height: '600px', width: '90vw' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => renderMarker(marker))}
      </MapContainer>
    </div>
  );
}
