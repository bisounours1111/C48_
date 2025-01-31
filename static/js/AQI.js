function getAQIColor(aqi) {
    if (aqi <= 50) return '#10B981'; // Vert
    if (aqi <= 100) return '#FBBF24'; // Jaune
    if (aqi <= 150) return '#F97316'; // Orange
    if (aqi <= 200) return '#EF4444'; // Rouge
    if (aqi <= 300) return '#8B5CF6'; // Violet
    return '#6B7280'; // Gris
  }

  function getAQILevel(aqi) {
    if (aqi <= 50) return "Bon"; // Vert
    if (aqi <= 100) return 'Moyen'; // Jaune
    if (aqi <= 150) return 'Mauvais'; // Orange
    if (aqi <= 200) return 'Très Mauvais'; // Rouge
    if (aqi <= 300) return 'Exécrable'; // Violet
    return 'COURS TA MERE'; // Gris
  }
  
  // Fonction pour initialiser le graphique AQI
// Plugin pour afficher le texte au centre du doughnut
// Plugin pour afficher et styliser le texte au centre du doughnut
Chart.register({
    id: 'centerText',
    beforeDraw: function (chart) {
      const width = chart.width,
            height = chart.height,
            ctx = chart.ctx;
  
      ctx.restore();
  
      // Taille de la police basée sur la taille du graphique
      const fontSize = (height / 8).toFixed(2);
      ctx.font = fontSize + "px 'Arial', sans-serif"; // Choix de la police (Arial ici)
      ctx.textBaseline = "middle";
  
      const text = $("#aqiValue").text(), // Prend la valeur AQI
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 1.75;
  
      // Style du texte
      ctx.fillStyle = "#FFFFFF"; // Couleur de texte
 // Largeur du contour
  
      // Ajout du contour autour du texte
      ctx.strokeText(text, textX, textY);
      ctx.fillText(text, textX, textY); // Remplissage du texte
  

      ctx.save();
    }
  });
  
  // Fonction pour initialiser le graphique AQI
  function initAQIChart() {
    const aqiCanvas = document.getElementById('aqiCanvas').getContext('2d');
  
    const aqiChart = new Chart(aqiCanvas, {
      type: 'doughnut',
      data: {
        labels: ['AQI', ''],
        datasets: [{
          data: [0, 300],
          backgroundColor: ['#F3F4F6', '#F3F4F6'],
          borderWidth: 0,
          circumference: 180,
          rotation: -90,
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          centerText: true // Active le plugin
        },
      },
    });
  
    return aqiChart;
  }
  
  // Fonction pour mettre à jour le graphique et le texte stylisé
  function updateAQIChart(aqiChart, aqi) {
    const color = getAQIColor(aqi);
    aqiChart.data.datasets[0].data = [aqi, 300 - aqi];
    aqiChart.data.datasets[0].backgroundColor = [color, '#F3F4F6'];
    aqiChart.update();
  }
  
  
  // Fonction pour récupérer la qualité de l'air et mettre à jour le graphique
  function getAirQuality(aqiChart) {
    $.ajax({
      url: `https://api.waqi.info/feed/Lille/?token=e1974ddb9bd3c9cf06ae278d6069b36bf2d25e70`,
      method: "GET",
      success: function(data) {
        if (data.status === 'ok') {
          const airQuality = data.data.aqi;
          const pm25 = data.data.iaqi.pm25 ? data.data.iaqi.pm25.v : 'N/A';
          const pm10 = data.data.iaqi.pm10 ? data.data.iaqi.pm10.v : 'N/A';
          console.log(`Qualité de l'air (AQI) pour Lille et la Mel: ${airQuality}`);

          
          $("#aqiValue").text(`${airQuality}`);
          $("#aqiLabel").text(`Qualité de l'air : ${getAQILevel(airQuality)}`);
          $("#pm25").text(`PM2.5: ${pm25} µg/m³`);
          $("#pm10").text(`PM10: ${pm10} µg/m³`);
          
          updateAQIChart(aqiChart, airQuality);
        } else {
          console.log("Erreur lors de la récupération des données de qualité de l'air");
        }
      },
      error: function() {
        console.log("Erreur avec l'API de qualité de l'air");
      }
    });
  }
  
  // Initialisation au chargement de la page
  $(document).ready(function() {
    const aqiChart = initAQIChart();
    getAirQuality(aqiChart);
  });