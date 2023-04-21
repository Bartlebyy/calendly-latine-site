import { GoogleSpreadsheet } from 'google-spreadsheet';

const doc = new GoogleSpreadsheet(process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID);

async function fetchSheetRow() {
  console.log('Fetching data...');
  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.NEXT_PUBLIC_GOOGLE_SHEET_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_GOOGLE_SHEET_PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows() || [];
    updateMissingLatLong(sheet, rows) 
    return rows
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return [];
  }
}

async function updateMissingLatLong(sheet, rows) {
  try {
    for (const row of rows) {
      if ((!row.Latitude || !row.Longitude) && !!row.Zipcode) {
        const zipcode = row.Zipcode;
        
        const [lat, lon] = await getLatLongFromZipcode(zipcode);
        await savePositionInSheet(sheet, row.rowNumber, lat, lon);
      }
    }
    console.log(`Done updating missing latitude and longitude.`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}


async function savePositionInSheet(sheet, rowNumber, lat, lon) {
  try {
    console.log(`Saving position (${lat}, ${lon}) in row ${rowNumber}...`);
    const rows = await sheet.getRows();
    const rowToUpdate = rows.find(row => row.rowNumber === rowNumber);
    if (rowToUpdate) {
      rowToUpdate.Latitude = lat;
      rowToUpdate.Longitude = lon;
      await rowToUpdate.save();
      console.log(`Saved position (${lat}, ${lon}) in row ${rowNumber}.`);
    } else {
      console.log(`Error: row ${rowNumber} not found.`);
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}


async function getLatLongFromZipcode(zipcode) {
  try {
    const baseUrl = 'https://nominatim.openstreetmap.org/search';
    const url = `${baseUrl}?format=json&postalcode=${zipcode}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      return [parseFloat(lat), parseFloat(lon)];
    }

    return [0, 0];
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return [0, 0];
  }
}

async function getPosition(zipcode, lat, long) {
  if(lat && long) {
    return [lat, long]
  }

  return await getLatLongFromZipcode(zipcode)
}

export { fetchSheetRow, getPosition };