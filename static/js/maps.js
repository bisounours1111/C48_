let map;
let markers = [];
let polygons = [];
let markerClusterer;

function initMap() {
    let initialPlace = { lat: 50.63506335331983, lng: 3.0582420070863803 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: initialPlace,
        disableDefaultUI: true,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
    
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "road.arterial", elementType: "geometry.fill", stylers: [{ color: "#ffe082" }] },
            { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ffcc80" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#ffa726" }] },
            { featureType: "road.local", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#80d8ff" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#007bb5" }] },
    
            { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#e0f7fa" }] },
            { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#b2ebf2" }] },
    
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#bdbdbd" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
    
            { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#d0d0d0" }] },
            { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#424242" }] }
        ]
    });
    

    // Initialisation du MarkerClusterer
    markerClusterer = new MarkerClusterer(map, [], {
        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        gridSize: 50,
        maxZoom: 15
    });
}

// Fonction pour charger les données GeoJSON et afficher des **points**
function loadGeoJson(url, iconUrl) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let newMarkers = [];

            data.features.forEach(feature => {
                let coords = feature.geometry.coordinates;
                let typeEngin = feature.properties.type_engin || "Point d'intérêt";

                if (iconUrl) {
                    let newIconUrl = null;
                    if (iconUrl === "/static/icons/velo.png") {
                        newIconUrl =    typeEngin === "VAE"         ? "/static/icons/velo.png"        :    
                                        typeEngin === "TE + VAE"    ? "/static/icons/trottinette.png" : null
                    }
                    let marker = new google.maps.Marker({
                        position: { lat: coords[1], lng: coords[0] },
                        icon: {
                            url: newIconUrl || iconUrl,
                            scaledSize: new google.maps.Size(40, 40)
                        },
                        title: typeEngin
                    });

                    markers.push(marker);
                    newMarkers.push(marker);
                }
            });

            // Ajouter les nouveaux marqueurs au cluster
            markerClusterer.addMarkers(newMarkers);
        })
        .catch(error => console.error("Erreur lors du chargement du fichier GeoJSON :", error));
}

// Fonction pour charger les **polygones (parcs)**
function loadParcGeoJson(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                let coordinates = feature.geometry.coordinates[0].map(coord => ({ lat: coord[1], lng: coord[0] }));

                let parcPolygon = new google.maps.Polygon({
                    paths: coordinates,
                    strokeColor: "#228B22",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#228B22",
                    fillOpacity: 0.4,
                    map: map
                });

                polygons.push(parcPolygon);
            });
        })
        .catch(error => console.error("Erreur lors du chargement du fichier GeoJSON :", error));
}

// Fonction pour ouvrir la popup et charger les données
function openPopup(geoJsonUrls, isParc = false) {
    popup.classList.remove("hidden");

    // Supprimer les anciens marqueurs et polygones
    markers.forEach(marker => marker.setMap(null));
    markerClusterer.clearMarkers(); // Supprime les marqueurs du cluster
    polygons.forEach(polygon => polygon.setMap(null));

    markers = [];
    polygons = [];

    // Charger les données en fonction du type
    geoJsonUrls.forEach(dataset => {
        if (dataset.isParc) {
            loadParcGeoJson(dataset.url);  // Charger des polygones
        } else {
            loadGeoJson(dataset.url, dataset.icon);  // Charger des points avec icônes spécifiques
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("openVelotrot").addEventListener("click", () => 
        openPopup([{ url: "/static/velotrot.geojson", icon: "/static/icons/velo.png" }])
    );

    document.getElementById("openDecheterieComposte").addEventListener("click", () => 
        openPopup([
            { url: "/static/composter.geojson", icon: "/static/icons/compost.png" },
            { url: "/static/dechet_mobile.geojson", icon: "/static/icons/recycle.png" },
            { url: "/static/dechet_fixe.geojson", icon: "/static/icons/recycle.png" }
        ])
    );

    document.getElementById("openParcs").addEventListener("click", () => 
        openPopup([{ url: "/static/parcs.geojson", isParc: true }])
    );

    document.getElementById("closePopupBtn").addEventListener("click", () => {
        popup.classList.add("hidden");
        markers.forEach(marker => marker.setMap(null));
        markerClusterer.clearMarkers(); // Supprime les marqueurs du cluster
        polygons.forEach(polygon => polygon.setMap(null));
    });

    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.classList.add("hidden");
            markers.forEach(marker => marker.setMap(null));
            markerClusterer.clearMarkers();
            polygons.forEach(polygon => polygon.setMap(null));
        }
    });
});
