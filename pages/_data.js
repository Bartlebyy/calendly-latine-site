import { GoogleSpreadsheet } from 'google-spreadsheet';

const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID);

async function fetchData() {
  console.log('Fetching data...');
  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.NEXT_PUBLIC_GOOGLE_SHEET_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_GOOGLE_SHEET_PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    return await sheet.getRows() || [];
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return [];
  }
}

async function getLatLongFromZipcode(zipcode) {
  const baseUrl = 'https://nominatim.openstreetmap.org/search';
  const url = `${baseUrl}?format=json&postalcode=${zipcode}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.length > 0) {
    const { lat, lon } = data[0];
    return [parseFloat(lat), parseFloat(lon)];
  }
  return [0, 0];
}

export { fetchData, getLatLongFromZipcode };