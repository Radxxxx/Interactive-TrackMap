/* =========================================================================
   NOTA SULLA PRECISIONE DEI DATI (leggere prima di modificare)
   =========================================================================
   - Il TRACCIATO è geometria reale, presa da una fonte geografica aperta
     (bacinger/f1-circuits, GeoJSON, dati derivati da OpenStreetMap).
     Questa parte è affidabile.
   - CANCELLI E PARCHEGGI sono stati riletti dalla MAPPA GENERALE UFFICIALE
     caricata dall'utente (screenshot del 14/07/2026), che mostra nomi,
     tipo di accesso (pedonale/veicolare/riservato FIA-FOM) e posizione
     relativa di ogni varco e parcheggio interno/esterno. Le coordinate
     lat/lng qui sotto NON sono estratte con un software di georeferenziazione
     (non ho "cliccato" sulla mappa con uno strumento di misura): le ho
     stimate leggendo visivamente la posizione relativa di ogni elemento
     sulla mappa e riportandola sulla geometria reale del tracciato (che
     invece è verificata). Considera quindi queste coordinate un forte
     miglioramento rispetto alla versione precedente (ora basata su una
     fonte ufficiale, non su blog di terze parti), ma non ancora una
     precisione da rilievo GPS.
   - Il campo `fonte` indica da dove viene ogni dato. Il campo `confidenza`
     indica quanto è solida la posizione geografica stimata.
   - Nomi come "Platino", "Verde", "Viola", "Arancione" (trovati in guide
     online di edizioni passate del GP) NON compaiono su questa mappa
     ufficiale: probabilmente appartengono a un'altra edizione/anno. Li ho
     rimossi per evitare di mischiare fonti diverse; se vi servono vanno
     riverificati a parte.
   - Le AREE PRATO e i PUNTI FOTO restano ancorati ai punti reali del
     tracciato (fonte GeoJSON), confidenza ALTA.
   - I RISTORANTI ESTERNI sono ancora segnaposto dimostrativi (il business
     "ristoranti affiliati" del progetto riguarda locali fuori dal parco,
     che la mappa ufficiale non mostra). La mappa ufficiale mostra invece
     "Punti di Ristoro" interni al circuito: sono un'altra cosa (ristoro
     ufficiale del circuito, non partner esterni) e li ho aggiunti come
     categoria informativa separata.

   FIX LAYOUT MOBILE (v3): la prima versione del fix forzava un'altezza fissa
   anche su .app-container/.main-layout da mobile. Ma .main-layout ha
   overflow:hidden, quindi forzarne l'altezza tagliava via il fondo del
   pannello laterale (incluso il bottone "Avvia Navigazione Satellitare").
   Ora su mobile sistemiamo SOLO l'altezza della mappa e lasciamo che il resto
   della pagina scorra naturalmente, come previsto dal CSS originale.

   Prima di andare in produzione: verificare comunque i punti a confidenza
   media con un pin manuale su Google Maps/Google Earth.
   ========================================================================= */

const poiData = [
    // --- PARCHEGGI INTERNI (icona verde "P" nella legenda ufficiale) ---
    {
        id: "p_gold", category: "parking", color: "#00E5FF", lat: 45.6102, lng: 9.2868,
        title: "P GOLD", stat1: "Parcheggio interno · accanto a Villa Reale",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Adiacente a Villa Reale e Porta Monza, l'ingresso storico del Parco. Posizione stimata leggendo la mappa ufficiale e ancorata all'estremo sud del tracciato reale."
    },
    {
        id: "p12", category: "parking", color: "#00E5FF", lat: 45.6225, lng: 9.2840,
        title: "P12", stat1: "Parcheggio interno · zona Ascari/Seconda Variante",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Parcheggio interno nella zona ovest del circuito, vicino alla Variante Ascari."
    },
    {
        id: "p13bus", category: "parking", color: "#00E5FF", lat: 45.6295, lng: 9.2910,
        title: "P13 BUS", stat1: "Parcheggio interno · autobus · zona Lesmo",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Area sosta bus vicina alla zona Lesmo/Seconda Variante, a nord del circuito."
    },
    {
        id: "p15", category: "parking", color: "#00E5FF", lat: 45.6235, lng: 9.2800,
        title: "P15", stat1: "Parcheggio interno · zona Curva Biassono",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Parcheggio interno vicino alla Curva Biassono (Curva Grande) e all'ingresso Costa Alta."
    },
    {
        id: "p16", category: "parking", color: "#00E5FF", lat: 45.6205, lng: 9.2822,
        title: "P16", stat1: "Parcheggio interno · vicino Gate B",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Parcheggio interno nella zona sud-ovest, vicino al Gate B e allo stand taxi."
    },
    {
        id: "p29", category: "parking", color: "#00E5FF", lat: 45.6182, lng: 9.2832,
        title: "P29", stat1: "Parcheggio interno · vicino rettilineo box",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Parcheggio interno vicino alle tribune del rettilineo dei box."
    },
    {
        id: "p37", category: "parking", color: "#00E5FF", lat: 45.6218, lng: 9.2848,
        title: "P37", stat1: "Parcheggio interno · zona centrale",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Parcheggio interno nella zona centrale del circuito, vicino a Variante Ascari e Prima Variante."
    },

    // --- PARCHEGGI ESTERNI (icona blu "P" nella legenda ufficiale) ---
    {
        id: "p_biassono_esterno", category: "parking", color: "#0077C8", lat: 45.6222, lng: 9.2735,
        title: "Parcheggio Esterno Biassono", stat1: "Parcheggio esterno · SP6 Monza-Carate",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Parcheggio fuori dal recinto del Parco, sul lato Biassono, lungo la SP6."
    },
    {
        id: "p_bus_esterno_lesmo", category: "parking", color: "#0077C8", lat: 45.6345, lng: 9.2895,
        title: "Parcheggio Bus Esterno · Lesmo", stat1: "Parcheggio esterno · autobus",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Area sosta bus esterna vicino alla Stazione Biassono-Lesmo Parco e all'area camping esterna Lesmo."
    },

    // --- CANCELLI (nomi e tipo di accesso letti dalla mappa ufficiale) ---
    {
        id: "g_e", category: "gates", color: "#FF007F", lat: 45.6335, lng: 9.2945,
        title: "Gate E", stat1: "Ingresso pedonale · zona Lesmo",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Ingresso pedonale vicino alla Curva di Lesmo e alla Stazione Biassono-Lesmo Parco, sul lato nord del circuito."
    },
    {
        id: "g_f", category: "gates", color: "#B00060", lat: 45.6310, lng: 9.2985,
        title: "Gate F · FIA-FOM", stat1: "Ingresso veicolare riservato",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Ingresso veicolare riservato (accrediti FIA-FOM), vicino al Gate E in zona Lesmo. Non è un ingresso per il pubblico generico."
    },
    {
        id: "g_costa_alta", category: "gates", color: "#B00060", lat: 45.6255, lng: 9.2788,
        title: "Ingresso Costa Alta · FIA-FOM", stat1: "Ingresso veicolare riservato",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Ingresso veicolare riservato (accrediti FIA-FOM) sul lato ovest, vicino alla Curva Biassono. Non è un ingresso per il pubblico generico."
    },
    {
        id: "g_c", category: "gates", color: "#FF007F", lat: 45.6230, lng: 9.2775,
        title: "Gate C", stat1: "Ingresso pedonale · zona Curva Biassono",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Ingresso pedonale sul lato sud-ovest, vicino a Via S. Maria alle Selve e ai parcheggi P15/P16."
    },
    {
        id: "g_b", category: "gates", color: "#FF007F", lat: 45.6195, lng: 9.2815,
        title: "Gate B", stat1: "Ingresso pedonale · vicino stand taxi",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Ingresso pedonale nella zona sud-centrale, vicino allo stand taxi e al parcheggio P16."
    },
    {
        id: "g_vedano", category: "gates", color: "#FF007F", lat: 45.6150, lng: 9.2835,
        title: "Ingresso/Gate Vedano A-B", stat1: "Ingresso veicolare · Via Vedano",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Ingresso veicolare combinato A-B su Via Vedano, a sud del circuito, vicino a Viale Cesare Battisti."
    },
    {
        id: "g_a", category: "gates", color: "#FF007F", lat: 45.6155, lng: 9.2865,
        title: "Gate A", stat1: "Ingresso veicolare · Viale Mirabello",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Ingresso veicolare sul lato est del circuito, vicino a Viale Mirabello, a sud del Gate G. Nota: su questa mappa il Gate A risulta distinto dall'ingresso 'Vedano A-B', diversamente da quanto riportato in alcune guide online di altre edizioni — verificare quale sia valido per l'anno di riferimento."
    },
    {
        id: "g_g", category: "gates", color: "#FF007F", lat: 45.6188, lng: 9.2878,
        title: "Gate G", stat1: "Ingresso veicolare · vicino Villa Mirabello",
        stat2: "Confidenza MEDIA — letta da mappa ufficiale",
        desc: "Ingresso veicolare sul lato est, vicino a Villa Mirabello e ai capolinea delle navette Linea Nera e Linea Blu."
    },

    // --- AREE PRATO (General Admission) — ancorate ai punti reali del tracciato ---
    {
        id: "ga_ascari", category: "ga", color: "#39FF14", lat: 45.6219, lng: 9.2859,
        title: "Prato · Variante Ascari", stat1: "Affollamento: alto",
        stat2: "Confidenza ALTA — punto reale del tracciato",
        desc: "Tra le zone prato più richieste del circuito: sequenza di curve molto scenografica. Conviene arrivare all'apertura cancelli."
    },
    {
        id: "ga_lesmo", category: "ga", color: "#39FF14", lat: 45.6313, lng: 9.2960,
        title: "Prato · Curve di Lesmo", stat1: "Affollamento: alto",
        stat2: "Confidenza ALTA — punto reale del tracciato",
        desc: "Zona molto gettonata insieme alla Roggia: si riempie rapidamente subito dopo l'apertura dei cancelli."
    },
    {
        id: "ga_grande", category: "ga", color: "#39FF14", lat: 45.6280, lng: 9.2824,
        title: "Prato · Curva Grande", stat1: "Affollamento: medio",
        stat2: "Confidenza ALTA — punto reale del tracciato",
        desc: "Vista sull'uscita dal rettilineo dei box, prima del lungo rettilineo di Lesmo."
    },
    {
        id: "ga_parabolica", category: "ga", color: "#39FF14", lat: 45.6119, lng: 9.2827,
        title: "Prato · Parabolica", stat1: "Affollamento: alto",
        stat2: "Confidenza ALTA — punto reale del tracciato",
        desc: "Zona storica e molto fotografata del circuito: previsto grande affollamento, conviene arrivare con largo anticipo."
    },
    {
        id: "ga_1variante", category: "ga", color: "#39FF14", lat: 45.6246, lng: 9.2821,
        title: "Prato · Prima Variante", stat1: "Affollamento: medio",
        stat2: "Confidenza ALTA — punto reale del tracciato",
        desc: "Vista sulla staccata subito dopo il rettilineo dei box. Meno affollata delle zone Lesmo/Ascari."
    },

    // --- PUNTI FOTO — ancorati ai punti reali del tracciato ---
    {
        id: "f_ascari", category: "photo", color: "#FFC107", lat: 45.6222, lng: 9.2854,
        title: "Foto · Variante Ascari", stat1: "-",
        stat2: "Confidenza ALTA — punto reale del tracciato",
        desc: "Sequenza sinistra-destra-sinistra molto scenografica, con maxi-schermo nelle vicinanze."
    },
    {
        id: "f_lesmo", category: "photo", color: "#FFC107", lat: 45.6300, lng: 9.2968,
        title: "Foto · Curve di Lesmo", stat1: "-",
        stat2: "Confidenza ALTA — punto reale del tracciato",
        desc: "Le auto arrivano in pieno regime dal Rettilineo di Lesmo: buona luce nella prima parte della giornata."
    },
    {
        id: "f_parabolica", category: "photo", color: "#FFC107", lat: 45.6122, lng: 9.2818,
        title: "Foto · Curva Parabolica", stat1: "-",
        stat2: "Confidenza ALTA — punto reale del tracciato",
        desc: "Il punto più iconico e fotografato del circuito."
    },

    // --- RISTORANTI ESTERNI (partner) — segnaposto dimostrativi, NON attività reali ---
    {
        id: "r1", category: "food", color: "#FF6B35", lat: 45.6175, lng: 9.2745,
        title: "Trattoria del Rettilineo *", stat1: "★ 4.6/5 (esempio)",
        stat2: "SEGNAPOSTO — non è un'attività reale",
        desc: "Esempio dimostrativo. La mappa ufficiale non mostra ristoranti esterni affiliati: questi vanno raccolti e verificati direttamente da voi."
    },
    {
        id: "r2", category: "food", color: "#FF6B35", lat: 45.6320, lng: 9.2955,
        title: "Osteria della Curva *", stat1: "★ 4.3/5 (esempio)",
        stat2: "SEGNAPOSTO — non è un'attività reale",
        desc: "Esempio dimostrativo. La mappa ufficiale non mostra ristoranti esterni affiliati: questi vanno raccolti e verificati direttamente da voi."
    },
    {
        id: "r3", category: "food", color: "#FF6B35", lat: 45.6148, lng: 9.2770,
        title: "Bistrot del Parco *", stat1: "★ 4.1/5 (esempio)",
        stat2: "SEGNAPOSTO — non è un'attività reale",
        desc: "Esempio dimostrativo. La mappa ufficiale non mostra ristoranti esterni affiliati: questi vanno raccolti e verificati direttamente da voi."
    }
];

// 2. INIZIALIZZAZIONE DELLA MAPPA
const map = L.map('map', {
    center: [45.6215, 9.2830],
    zoom: 14,
    minZoom: 13,
    maxZoom: 18
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(map);

// FIX LAYOUT (v4): pagina bloccata anche su mobile (niente più scroll di tutta la
// pagina). La mappa ha un'altezza fissa, il pannello laterale riempie lo spazio
// restante e scorre SOLO al suo interno (grazie a flex:1 + min-height:0 + overflow-y:auto
// nel CSS). Continuiamo a calcolare le altezze in pixel reali invece di affidarci a
// vh/dvh, che su alcuni browser mobile vengono interpretati in modo incoerente.
function sizeLayout() {
    const vh = window.innerHeight;
    const isMobile = window.innerWidth <= 768;

    const header = document.querySelector('.app-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const mainLayoutHeight = vh - headerHeight;

    document.querySelector('.app-container').style.height = vh + 'px';
    document.querySelector('.main-layout').style.height = mainLayoutHeight + 'px';

    if (isMobile) {
        const mapHeight = Math.max(380, mainLayoutHeight * 0.5);
        document.querySelector('.map-section').style.height = mapHeight + 'px';
        document.getElementById('map').style.height = mapHeight + 'px';
        // Il pannello NON riceve un'altezza fissata da qui: flex:1 + min-height:0
        // nel CSS lo fanno riempire lo spazio restante, e overflow-y:auto lo fa
        // scorrere internamente quando il contenuto è più alto dello spazio disponibile.
    } else {
        document.querySelector('.map-section').style.height = mainLayoutHeight + 'px';
        document.getElementById('map').style.height = mainLayoutHeight + 'px';
    }

    map.invalidateSize();
}
window.addEventListener('load', sizeLayout);
window.addEventListener('resize', sizeLayout);
window.addEventListener('orientationchange', () => setTimeout(sizeLayout, 300));
sizeLayout();

// 3. CARICAMENTO TRACCIATO REALE DA GEOJSON LOCALE (scaricato una volta da bacinger/f1-circuits,
//    derivato da OpenStreetMap, salvato nel repo per non dipendere da raw.githubusercontent.com)
fetch('data/monza-track.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        L.geoJSON(geojsonData, {
            style: {
                color: '#ff1801',
                weight: 5,
                opacity: 1.0,
                lineJoin: 'round'
            }
        }).addTo(map);
    })
    .catch(err => console.error("Errore nel caricamento del GeoJSON:", err));

// 4. GENERAZIONE MARKER PUNTI DI INTERESSE
let markersLayer = [];

function initMapMarkers() {
    poiData.forEach(poi => {
        try {
            const markerIcon = L.divIcon({
                className: 'custom-div-marker',
                html: `<div class="marker-dot" style="background-color: ${poi.color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 8px rgba(0,0,0,0.6);"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });

            const marker = L.marker([poi.lat, poi.lng], { icon: markerIcon }).addTo(map);

            markersLayer.push({
                category: poi.category,
                instance: marker
            });

            marker.on('click', () => {
                document.getElementById('panel-placeholder').classList.add('hidden');
                document.getElementById('panel-content').classList.remove('hidden');

                document.getElementById('info-title').innerText = poi.title;
                document.getElementById('info-stat1').innerText = poi.stat1;
                document.getElementById('info-stat2').innerText = poi.stat2;
                document.getElementById('info-desc').innerText = poi.desc;

                document.getElementById('info-link').href = `https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lng}`;

                map.panTo([poi.lat, poi.lng]);
            });
        } catch (e) {
            console.error("Errore durante la creazione del marker:", poi.title, e);
        }
    });
}

initMapMarkers();

// 5. GESTIONE FILTRI BOTTONI
const filterBtns = document.querySelectorAll('.filter-bar .filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const targetCategory = e.target.getAttribute('data-target');

        markersLayer.forEach(item => {
            if (targetCategory === 'all' || item.category === targetCategory) {
                map.addLayer(item.instance);
            } else {
                map.removeLayer(item.instance);
            }
        });

        document.getElementById('panel-placeholder').classList.remove('hidden');
        document.getElementById('panel-content').classList.add('hidden');
    });
});