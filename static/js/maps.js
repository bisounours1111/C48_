let map;
let markers = [];
let polygons = [];
let markerClusterer;
let infoWindow; // Ajout d'une infoWindow pour les marqueurs et polygones

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
    

    infoWindow = new google.maps.InfoWindow(); // Création d'une seule InfoWindow

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

                // Traitement des icônes vélo et trottinette
                if (iconUrl === "/static/icons/velo.png") {

                    newIconUrl =    typeEngin === "VAE"         ? "/static/icons/velo.png"        :    
                                        typeEngin === "TE + VAE"    ? "/static/icons/trottinette.png" : null

                    // Si une icône est trouvée, créer un marqueur
                    if (newIconUrl) {
                        let marker = new google.maps.Marker({
                            position: { lat: coords[1], lng: coords[0] },
                            icon: {
                                url: newIconUrl,
                                scaledSize: new google.maps.Size(40, 40)
                            },
                            title: typeEngin,
                            map: map
                        });

                        marker.addListener("click", () => {
                            infoWindow.setContent(`<strong>${typeEngin}</strong><br>`);
                            infoWindow.open(map, marker);
                        });

                        markers.push(marker);
                        newMarkers.push(marker);
                    }
                }

                // Marqueurs de recyclage et compost
                else if (iconUrl === "/static/icons/recycle_vert.png" || iconUrl === "/static/icons/recycle.png" || iconUrl === "/static/icons/compost.png") {
                    let nom = feature.properties.nom || feature.properties.nom_site;

                    let horaire = feature.properties.information || "Aucune information";
                    let access = feature.properties.lib_acces || "Accès non spécifié";

                    let marker = new google.maps.Marker({
                        position: { lat: coords[1], lng: coords[0] },
                        icon: {
                            url: iconUrl,
                            scaledSize: new google.maps.Size(40, 40)
                        },
                        title: "Point de recyclage / Compost",
                        map: map
                    });

                    marker.addListener("click", () => {
                        let content = iconUrl === "/static/icons/compost.png" 
                            ? `<strong>${nom}</strong><br>${access}`
                            : `<strong>${nom}</strong><br>: ${horaire}`;
                        infoWindow.setContent(content);
                        infoWindow.open(map, marker);
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
                let parcName = feature.properties.nom || "Parc";
                let parcDescription = 
                feature.properties.etat_ouver === "Permanente" 
                    ? "Ouvert en permanence" 
                    : (feature.properties.horaires_o && feature.properties.horaires_1 
                        ? feature.properties.horaires_o + " - " + feature.properties.horaires_1 
                        : "Aucune information disponible.");


                let parcPolygon = new google.maps.Polygon({
                    paths: coordinates,
                    strokeColor: "#228B22",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#228B22",
                    fillOpacity: 0.4,
                    map: map
                });

                // Ajouter un événement de clic sur le polygone
                parcPolygon.addListener("click", (event) => {
                    infoWindow.setContent(`<strong>${parcName}</strong><br>${parcDescription}`);
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                });

                polygons.push(parcPolygon);
            });
        })
        .catch(error => console.error("Erreur lors du chargement du fichier GeoJSON :", error));
}


function openPopup(geoJsonUrls) {
    popup.classList.remove("hidden");

    // Supprimer les anciens marqueurs et polygones
    markers.forEach(marker => marker.setMap(null));
    markerClusterer.clearMarkers();
    polygons.forEach(polygon => polygon.setMap(null));

    markers = [];
    polygons = [];

    // Charger les données en fonction du type
    geoJsonUrls.forEach(dataset => {
        if (dataset.isParc) {
            loadParcGeoJson(dataset.url);
        } else {
            loadGeoJson(dataset.url, dataset.icon);
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
            { url: "/static/dechet_fixe.geojson", icon: "/static/icons/recycle_vert.png" }
        ])
    );

    document.getElementById("openParcs").addEventListener("click", () => 
        openPopup([{ url: "/static/parcs.geojson", isParc: true }])
    );

    document.getElementById("closePopupBtn").addEventListener("click", () => {
        popup.classList.add("hidden");
        markers.forEach(marker => marker.setMap(null));
        markerClusterer.clearMarkers();
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