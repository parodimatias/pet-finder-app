import * as MapboxClient from "../node_modules/mapbox";
import * as mapboxgl from "../node_modules/mapbox-gl/dist/mapbox-gl.js";
import { state } from "../fe-src/state";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWF0aWFzcGFyb2RpIiwiYSI6ImNreTh6NnNlcDAxZXQycWs5c2VndTQxemYifQ.g5ici0kzf8C_pEntf30JYA";
const mapboxClient = new MapboxClient(MAPBOX_TOKEN);
export function initMap(map) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  const cs = state.getState();
  return new mapboxgl.Map({
    container: map,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [cs.reportPetLng, cs.reportPetLat],
    zoom: 14,
  });
}
export async function initSearchForm(map, searchText) {
  const a = await mapboxClient.geocodeForward(
    searchText,
    {
      country: "ar",
      autocomplete: true,
      language: "es",
    },
    function (err, data, res) {
      if (!err) {
        const cs = state.getState();
        const firstResult = data.features[0];
        const marker = new mapboxgl.Marker({
          draggable: true,
        })
          .setLngLat(firstResult.geometry.coordinates)
          .addTo(map);
        console.log(marker);
        function onDragEnd() {
          const cs = state.getState();
          cs.reportPetLat = marker.getLngLat().lat;
          cs.reportPetLng = marker.getLngLat().lng;
          state.setState(cs);
        }

        marker.on("dragend", onDragEnd);
        map.setCenter(firstResult.geometry.coordinates);
        map.setZoom(14);

        cs.reportPetLat = marker.getLngLat().lat;
        cs.reportPetLng = marker.getLngLat().lng;
        state.setState(cs);
      }
    }
  );
}
