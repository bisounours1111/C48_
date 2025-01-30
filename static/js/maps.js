let map;
let markers = [];
function initMap() {
    let initialPlace = { lat: 50.63506335331983, lng: 3.0582420070863803 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: initialPlace,
        disableDefaultUI: true,
        styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
    });
    fetch("/static/velotrot.geojson")
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                let coords = feature.geometry.coordinates;
                let typeEngin = feature.properties.type_engin;
                let iconUrl = typeEngin === "VAE" ? "/static/icons/velo.png" :
                              typeEngin === "TE + VAE" ? "/static/icons/trottinette.png" : null;
                if (iconUrl) {
                    let marker = new google.maps.Marker({
                        position: { lat: coords[1], lng: coords[0] },
                        map: map,
                        icon: {
                            url: iconUrl,
                            scaledSize: new google.maps.Size(40, 40)
                        },
                        title: typeEngin
                    });
                    markers.push(marker); // Ajout du marqueur au tableau
                }
            });
            // ✅ Ajout du Marker Clusterer
            new MarkerClusterer(map, markers, {
                imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
                gridSize: 50, // Taille de regroupement (50px)
                maxZoom: 15    // Ne pas clusteriser en dessous du zoom 15
            });
        })
        .catch(error => console.error("Erreur lors du chargement du fichier GeoJSON :", error));
}