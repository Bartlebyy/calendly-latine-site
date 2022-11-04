import React from 'react';
import styles from '../styles/Home.module.css'
import L from "leaflet";
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const position = [39.8283, -98.5795]
const icon = L.icon({ iconUrl: "/flags/nicaragua.png", className: styles.marker });

export default function Map() {
  return (
    <div>
      <MapContainer center={position} zoom={4} scrollWheelZoom={false} style={{height: '600px',width: '90vw'}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>

        <Marker position={[52.515, -0.08]}>
          <Popup>
            Test.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
    
  )
}