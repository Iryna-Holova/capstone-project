const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => degrees * (Math.PI / 180);

export const getBoundingBox = (lat: number, lon: number, radius: number) => {
  const latInRad = toRadians(lat);

  const deltaLat = radius / EARTH_RADIUS_KM;
  const deltaLon = radius / (EARTH_RADIUS_KM * Math.cos(latInRad));

  const minLat = lat - deltaLat;
  const maxLat = lat + deltaLat;
  const minLon = lon - deltaLon;
  const maxLon = lon + deltaLon;

  return { minLat, maxLat, minLon, maxLon };
};
