import * as MapboxClient from "mapbox";
import * as mapboxgl from "mapbox-gl";
import { state } from "../state";
const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);
export function initMap(map) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWF0aWFzcGFyb2RpIiwiYSI6ImNreTh6NnNlcDAxZXQycWs5c2VndTQxemYifQ.g5ici0kzf8C_pEntf30JYA";
  const cs = state.getState();

  const newMap = new mapboxgl.Map({
    container: map,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [cs.reportPetLng, cs.reportPetLat],
    zoom: 14,
  });
  if (cs.reportPetLng && cs.reportPetLat) {
    const marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([cs.reportPetLng, cs.reportPetLat])
      .addTo(newMap);
    function onDragEnd() {
      const cs = state.getState();
      cs.reportPetLat = marker.getLngLat().lat;
      cs.reportPetLng = marker.getLngLat().lng;
      state.setState(cs);
    }

    marker.on("dragend", onDragEnd);
  }
  return newMap;
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
export async function geocodeReverse(lat, lng) {
  const response = await mapboxClient.geocoding
    .reverseGeocode({
      query: lng,
      lat,
    })
    .send();
  console.log(response);
  // if (
  //   response &&
  //   response.body &&
  //   response.body.features &&
  //   response.body.features.length
  // ) {
  //   var feature = response.body.features[0];
  return "hola";
  // }
}
