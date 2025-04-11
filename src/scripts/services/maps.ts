declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

const API_KEY = "AIzaSyAg6SxaMiG7uWavFNra3nUKLbSWmrU4Bwc";
const MAP_ID = "4453c34a36f32d0e";

export const loadGoogleMaps = async () => {
  if (window.google?.maps) return window.google.maps;

  return new Promise<typeof google.maps>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initGoogleMaps&loading=async&v=weekly`;
    script.async = true;
    window.initGoogleMaps = () => resolve(google.maps);

    script.onerror = () => reject(new Error("Google Maps API failed to load."));
    document.head.appendChild(script);
  });
};

type Position = {
  lat: number;
  lng: number;
};

export const initMap = async (position: Position): Promise<void> => {
  const mapContainer = document.getElementById("map") as HTMLDivElement;
  if (!mapContainer) {
    console.error("Map container not found!");
    return;
  }
  try {
    await loadGoogleMaps();
    const { Map } = (await google.maps.importLibrary(
      "maps"
    )) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;

    const map = new Map(mapContainer, {
      center: position,
      zoom: 10,
      mapId: MAP_ID,
    });

    new AdvancedMarkerElement({
      map,
      position: position,
    });
  } catch (error) {
    console.error("Error loading Google Maps:", error);
  }
};
