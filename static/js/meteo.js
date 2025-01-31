const apiKey = '9fa1846c705fd3e5aeb14ea07130caece699828d798754f22a653001859a9dc5';


const weatherIcons = {
    0: "wi-day-sunny",       // Soleil
    1: "wi-day-cloudy",      // Peu nuageux
    2: "wi-cloud",           // Ciel voilé
    3: "wi-cloudy",          // Nuageux
    4: "wi-cloudy",          // Très nuageux
    5: "wi-cloudy",          // Couvert
    6: "wi-fog",             // Brouillard
    7: "wi-fog",             // Brouillard givrant
    10: "wi-rain",           // Pluie faible
    11: "wi-rain",           // Pluie modérée
    12: "wi-rain-wind",      // Pluie forte
    13: "wi-sleet",          // Pluie faible verglaçante
    14: "wi-sleet",          // Pluie modérée verglaçante
    15: "wi-sleet",          // Pluie forte verglaçante
    16: "wi-showers",        // Bruine
    20: "wi-snow",           // Neige faible
    21: "wi-snow",           // Neige modérée
    22: "wi-snow-wind",      // Neige forte
    30: "wi-snowflake-cold", // Pluie et neige mêlées faibles
    40: "wi-day-showers",    // Averses locales et faibles
    42: "wi-day-rain",       // Averses locales et fortes
    60: "wi-snow",           // Averses de neige localisées
    100: "wi-thunderstorm",  // Orages faibles et locaux
    105: "wi-lightning",     // Orages forts
    140: "wi-rain",          // Pluies orageuses
};
const weatherDescriptions = {
    0: "Soleil",
	1: "Peu nuageux",
	2: "Ciel voilé",
	3: "Nuageux",
	4: "Très nuageux",
	5: "Couvert",
	6: "Brouillard",
	7: "Brouillard givrant",
	10: "Pluie faible",
	11: "Pluie modérée",
	12: "Pluie forte",
	13: "Pluie faible verglaçante",
	14: "Pluie modérée verglaçante",
	15: "Pluie forte verglaçante",
	16: "Bruine",
	20: "Neige faible",
	21: "Neige modérée",
	22: "Neige forte",
	30: "Pluie et neige mêlées faibles",
	31: "Pluie et neige mêlées modérées",
	32: "Pluie et neige mêlées fortes",
	40: "Averses de pluie locales et faibles",
	41: "Averses de pluie locales",
	42: "Averses locales et fortes",
	43: "Averses de pluie faibles",
	44: "Averses de pluie",
	45: "Averses de pluie fortes",
	46: "Averses de pluie faibles et fréquentes",
	47: "Averses de pluie fréquentes",
	48: "Averses de pluie fortes et fréquentes",
	60: "Averses de neige localisées et faibles",
	61: "Averses de neige localisées",
	62: "Averses de neige localisées et fortes",
	63: "Averses de neige faibles",
	64: "Averses de neige",
	65: "Averses de neige fortes",
	66: "Averses de neige faibles et fréquentes",
	67: "Averses de neige fréquentes",
	68: "Averses de neige fortes et fréquentes",
	70: "Averses de pluie et neige mêlées localisées et faibles",
	71: "Averses de pluie et neige mêlées localisées",
	72: "Averses de pluie et neige mêlées localisées et fortes",
	73: "Averses de pluie et neige mêlées faibles",
	74: "Averses de pluie et neige mêlées",
	75: "Averses de pluie et neige mêlées fortes",
	76: "Averses de pluie et neige mêlées faibles et nombreuses",
	77: "Averses de pluie et neige mêlées fréquentes",
	78: "Averses de pluie et neige mêlées fortes et fréquentes",
	100: "Orages faibles et locaux",
	101: "Orages locaux",
	102: "Orages fort et locaux",
	103: "Orages faibles",
	104: "Orages",
	105: "Orages forts",
	106: "Orages faibles et fréquents",
	107: "Orages fréquents",
	108: "Orages forts et fréquents",
	120: "Orages faibles et locaux de neige ou grésil",
	121: "Orages locaux de neige ou grésil",
	122: "Orages locaux de neige ou grésil",
	123: "Orages faibles de neige ou grésil",
	124: "Orages de neige ou grésil",
	125: "Orages de neige ou grésil",
	126: "Orages faibles et fréquents de neige ou grésil",
	127: "Orages fréquents de neige ou grésil",
	128: "Orages fréquents de neige ou grésil",
	130: "Orages faibles et locaux de pluie et neige mêlées ou grésil",
	131: "Orages locaux de pluie et neige mêlées ou grésil",
	132: "Orages fort et locaux de pluie et neige mêlées ou grésil",
	133: "Orages faibles de pluie et neige mêlées ou grésil",
	134: "Orages de pluie et neige mêlées ou grésil",
	135: "Orages forts de pluie et neige mêlées ou grésil",
	136: "Orages faibles et fréquents de pluie et neige mêlées ou grésil",
	137: "Orages fréquents de pluie et neige mêlées ou grésil",
	138: "Orages forts et fréquents de pluie et neige mêlées ou grésil",
	140: "Pluies orageuses",
	141: "Pluie et neige mêlées à caractère orageux",
	142: "Neige à caractère orageux",
	210: "Pluie faible intermittente",
	211: "Pluie modérée intermittente",
	212: "Pluie forte intermittente",
	220: "Neige faible intermittente",
	221: "Neige modérée intermittente",
	222: "Neige forte intermittente",
	230: "Pluie et neige mêlées",
	231: "Pluie et neige mêlées",
	232: "Pluie et neige mêlées",
	235: "Averses de grêle",
};
// Fonction pour obtenir la météo en fonction des coordonnées
function getWeather() {
	let lat = 50.6244;
	let lon = 3.0679;
    // URL de l'API de Météo Concept avec les bonnes informations
    const url = `https://api.meteo-concept.com/api/forecast/nextHours?latlng=${lat},${lon}&token=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('location').textContent = 'Erreur API: ' + data.error.message;
                return;
            }

            // Récupérer et afficher les données météo
            const location = `${data.city.name}`;
            const temperature = data.forecast[0].temp2m; // Température actuelle à 2m
            const weatherCode = data.forecast[0].weather; // Code météo numérique
            const description = weatherDescriptions[weatherCode] || "Inconnu"; // Description du temps
            const humidity = data.forecast[0].rh2m; // Humidité
            const windSpeed = data.forecast[0].wind10m; // Vitesse du vent à 10m
            const icon = weatherIcons[weatherCode]; // Icône météo

            document.getElementById('location').textContent = location;
            document.getElementById('temperature').textContent = `${temperature}°C`;
            document.getElementById('weather-description').textContent = description.charAt(0).toUpperCase() + description.slice(1);
            document.getElementById("weather-icon").className = `wi ${icon} text-4xl`;
            document.getElementById('humidity').textContent = `${humidity}%`;
            document.getElementById('wind-speed').textContent = `${windSpeed} km/h`;
            document.getElementById('weather-icon').src = icon;
        })
        .catch(error => {
            console.error('Erreur météo:', error);
            document.getElementById('location').textContent = 'Erreur lors de la récupération des données.';
        });
}

getWeather();