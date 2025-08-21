// src/getUserLocation.js

export const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported, using fallback location.");
      resolve({ lat: 17.3851, lon: 78.4866 }); // Hyderabad fallback
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Failed to get GPS location. Using fallback location.");
          resolve({ lat: 17.3851, lon: 78.4866 });
        },
        { timeout: 10000 }
      );
    }
  });
};

export const getCityFromCoords = async ({ lat, lon }) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();

    let city =
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.hamlet ||
      "Unknown";

    city = city.replace(/municipal corporation|corporation|district|city/i, "").trim();

    return city;
  } catch (err) {
    console.error("Failed to fetch city from coordinates:", err);
    return "Unknown";
  }
};
