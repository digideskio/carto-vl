const map = new carto.Map({
    container: 'map',
    background: 'black'
});

const source = new carto.source.GeoJSON(sources['multi-line-string']);
const style = new carto.Style('width: 30');
const layer = new carto.Layer('layer', source, style);

layer.addTo(map);
