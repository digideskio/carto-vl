const map = new mapboxgl.Map({
    container: 'map',
    style: { version: 8, sources: {}, layers: [] },
    center: [0, 0],
    zoom: 0
});

const points = new carto.source.GeoJSON(sources['points-with-5-properties']);
const viz1 = new carto.Viz('width: 100, color: rgba(255, 0, 0, 0.5)');
const viz2 = new carto.Viz('width: 70, color: rgba(0, 0, 255, 0.5)');
const layer1 = new carto.Layer('layer1', points, viz1);
const layer2 = new carto.Layer('layer2', points, viz2);
layer1.addTo(map);
layer2.addTo(map);
