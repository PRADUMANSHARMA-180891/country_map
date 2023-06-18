import "./map.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

function WordMap() {
  const markerIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png", //change icon color to grey
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const [countryList, setCountryList] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null); // add a new state to store the filtered list
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  console.log(typeof mapCenter);
  const [mapZoom, setMapZoom] = useState(3);
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryList(data);
        setFilteredCountries(data); // set the initial value of filteredCountries to be equal to countryList
      })
      .catch((err) => console.log("Error:", err));
  }, []);
  function filterItems(countryList, query) {
    return countryList.filter(
      (el) => el.name.common.toLowerCase().includes(query.toLowerCase()) //filters out the names from the fetch API into a new function
    );
  }

  function zoomCountryMap(latlng) {
    //function to zoom in on selected country
    console.log("zoomCountryMap called with latlng:", latlng);
    setMapCenter([latlng[0], latlng[1]]);
    setMapZoom(5);
  }
  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search by country..."
        style={{
          backgroundColor: "white",
          padding: "0.5em",
          paddingLeft: "1.5em",
          fontSize: "16px",
        }}
        onChange={(e) => {
          setFilteredCountries(filterItems(countryList, e.target.value));
          console.log(filterItems(countryList, e.target.value));
        }}
      />

      <div style={{ height: "100vh", width: "700px", overflow: "scroll" }}>
        <table id="country">
          <thead>
            <tr className="sticky-heading">
              <th className="table-cell" style={{ width: "200px" }}>
                Country
              </th>
              <th className="table-cell" style={{ width: "200px" }}>
                Capital
              </th>
              <th className="table-cell" style={{ width: "200px" }}>
                Region
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries ? ( // check if filteredCountryList is not null
              filteredCountries.map(
                (
                  table // iterate over the filtered list
                ) => (
                  <tr key={table.name.common}>
                    <td>{table.name.common}</td>
                    <td>{table.capital}</td>
                    <td>{table.region}</td>
                    <td>
                      <button onClick={() => zoomCountryMap(table.latlng)}>
                        Zoom
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="3">Search for country...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={false}
        onClick={() => console.log("MapContainer clicked")}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />
          
        {countryList &&
          countryList.map((markers) => (
            <Marker
              key={markers.name.common}
              position={[markers.latlng[0], markers.latlng[1]]}
              icon={markerIcon}
            >
              <Popup>
                <h1> {markers.name.common} </h1>
                <h3>
                  <p> Capital: {markers.capital}</p>
                  <p> Region: {markers.region}</p>
                  <p> Subregion: {markers.subregion}</p>
                  <p>
                    {" "}
                    Currencies:{" "}
                    {Object.keys(markers.currencies ?? {}) // looping trough all currencies, then getting name from    object in value

                      .map((key) => markers.currencies[key]["name"])
                      .join(", ")}{" "}
                  </p>
                </h3>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export default WordMap;