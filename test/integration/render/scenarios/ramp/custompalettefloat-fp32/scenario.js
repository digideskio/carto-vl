const map = new carto.Map({
    container: 'map',
    background: 'black'
});

const source = new carto.source.GeoJSON(sources['points']);
// Check that precision is good
const viz = new carto.Viz('width: ramp(linear($numeric, 0, 10), [0.10,0.20,0.30]) * 100');
const layer = new carto.Layer('layer', source, viz);

layer.addTo(map);
