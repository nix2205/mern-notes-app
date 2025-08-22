// // src/getUserLocation.js

// export const getUserLocation = () => {
//   return new Promise((resolve) => {
//     if (!navigator.geolocation) {
//       console.warn("Geolocation not supported, using fallback location.");
//       resolve({ lat: 17.3851, lon: 78.4866 }); // Hyderabad fallback
//     } else {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           resolve({
//             lat: pos.coords.latitude,
//             lon: pos.coords.longitude,
//           });
//         },
//         (err) => {
//           console.warn("Failed to get GPS location. Using fallback location.");
//           resolve({ lat: 17.3851, lon: 78.4866 });
//         },
//         { timeout: 10000 }
//       );
//     }
//   });
// };

// export const getCityFromCoords = async ({ lat, lon }) => {
//   try {
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
//     );
//     const data = await response.json();

//     let city =
//       data?.address?.city ||
//       data?.address?.town ||
//       data?.address?.village ||
//       data?.address?.hamlet ||
//       "Unknown";

//     city = city.replace(/municipal corporation|corporation|district|city/i, "").trim();

//     return city;
//   } catch (err) {
//     console.error("Failed to fetch city from coordinates:", err);
//     return "Unknown";
//   }
// };


// src/getUserLocation.js

// Fallback: IP-based geolocation
const getLocationByIP = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    if (data?.latitude && data?.longitude) {
      return { lat: data.latitude, lon: data.longitude };
    }
    throw new Error("IP location not available");
  } catch (err) {
    console.error("Failed to fetch IP location:", err);
    throw err;
  }
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported, trying IP...");
      getLocationByIP()
        .then(resolve)
        .catch(() => reject(new Error("Could not fetch location")));
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        async (err) => {
          console.warn("GPS failed:", err.message, " → trying IP...");
          try {
            const ipLoc = await getLocationByIP();
            resolve(ipLoc);
          } catch {
            reject(new Error("Could not fetch location"));
          }
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    }
  });
};

export const getCityFromCoords = async ({ lat, lon }) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
    );
    const data = await response.json();

    let city =
      data?.address?.suburb ||
      data?.address?.neighbourhood ||
      data?.address?.quarter ||
      data?.address?.village ||
      data?.address?.town ||
      data?.address?.city_district ||
      data?.address?.state_district ||
      data?.address?.city ||
      data?.address?.county;

    if (!city) throw new Error("City not found in reverse geocode");

    city = city.replace(
      /municipal corporation|corporation|district|city|mandal|block/gi,
      ""
    ).trim();

    return city;
  } catch (err) {
    console.error("Failed to fetch city from coordinates:", err);
    throw new Error("Could not fetch city");
  }
};
