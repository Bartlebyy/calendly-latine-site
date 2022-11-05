import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from "leaflet";
import { GoogleSpreadsheet } from "google-spreadsheet"

import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
import styles from '../styles/Home.module.css'

const position = [39.8283, -98.5795]
const icon = L.icon({ iconUrl: "/flags/nicaragua.png", className: styles.marker });
const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID)

export default function Map() {
  const [rows, setRows] = useState([])
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    async function getData(doc) {
      await doc.useServiceAccountAuth({
        client_email: process.env.NEXT_PUBLIC_GOOGLE_SHEET_CLIENT_EMAIL,
        private_key: process.env.NEXT_PUBLIC_GOOGLE_SHEET_PRIVATE_KEY
      }, function(err) {
        if(!err){
          doc.getRow(1,function(error,row){
              if(!error && row){
                console.log(row);
              }else{
                 console.log('ERROR IN getRow :'+error);
              }
           });

        }else{
          console.log('ERROR IN useServiceAccountAuth : '+err);
        }
      });
      await doc.loadInfo()
      const sheet = doc.sheetsByIndex[0]
      const rows = await sheet.getRows();
      setRows(rows)
    }
    getData(doc)
  }, [])

  useEffect(()=> {
    rows.filter((row)=> {
      const name = row['Full name']
      const zipcode = row['Zipcode']
      const country = row['Country']

      if(country && zipcode && name) {
        return true
      } else {
        return false
      }
    }).map((row)=> {
      const name = row['Full name']
      const zipcode = row['Zipcode']
      const country = row['Country']
      let flagURL = ''
      const str = country.replace(/\s+/g, '-').toLowerCase()
      flagURL = `/flags/${str}.png`
  
      const marker = {
        message: `This is where ${name} lives. <br /> Their family is from ${country}.`,
        position: [Math.random()/5*100+30, -Math.random()/2*100-70],
        icon: L.icon({ iconUrl: flagURL, className: styles.marker })
      }
      setMarkers(markers => [...markers, marker]);
    })
  }, [rows])

  const markerComponent = ((markerObj) => (
    <Marker position={markerObj.position} icon={markerObj.icon}>
      <Popup>
        {markerObj.message}
      </Popup>
    </Marker>
  ))

  return (
    <div>
      <MapContainer center={position} zoom={4} scrollWheelZoom={false} style={{height: '600px',width: '90vw'}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker)=> (
          markerComponent(marker)
        ))}
      </MapContainer>
    </div>
    
  )
}