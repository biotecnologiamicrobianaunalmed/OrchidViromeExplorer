
import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { tsvParse } from "d3-dsv";

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

export default function VirusMap() {
  const [countryData, setCountryData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Cargando TSV...");
    fetch(process.env.PUBLIC_URL + "/virus_data/Table_virus.tsv")
      .then((res) => res.text())
      .then((text) => {
        const data = tsvParse(text);
        console.log("TSV parseado:", data.slice(0, 5));
        // Agrupar por país (campo 'country')
        const byCountry = {};
        data.forEach(row => {
          const country = (row.country || row.Country || row.Pais || "").trim();
          if (!country) return;
          if (!byCountry[country]) byCountry[country] = [];
          byCountry[country].push(row);
        });
        console.log("Datos agrupados por país:", Object.keys(byCountry));
        setCountryData(byCountry);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando TSV:", err);
      });
  }, []);

  // Derive selected country data and simple summaries
  const selectedData = selectedCountry ? countryData[selectedCountry] || [] : [];
  const uniqueViruses = Array.from(
    new Set(
      selectedData
        .map((r) => r.virus || r.Virus || r.virus_name || r.VirusName)
        .filter(Boolean)
    )
  );
  const topViruses = uniqueViruses.slice(0, 10);

  // Build datasets per virus for the selected country
  const datasetsByVirus = selectedData.reduce((acc, r) => {
    const v = r.virus || r.Virus || r.virus_name || r.VirusName;
    if (!v) return acc;
    const d = r.dataset || r.Dataset || r.data_set || r.DataSet || r.DATASET || "not_found";
    if (!acc[v]) acc[v] = new Set();
    acc[v].add(d);
    return acc;
  }, {});

  return (
    <div style={{ width: "100%", margin: 0 }}>
      {/* Info box */}
      <div
        style={{
          width: "100%",
          background: "#1a1a1a",
          color: "#f1f1f1",
          padding: "16px 20px",
          borderRadius: 12,
          boxSizing: "border-box",
          marginBottom: 16,
        }}
      >
        {loading ? (
          <p style={{ margin: 0 }}>Cargando datos...</p>
        ) : !selectedCountry ? (
          <p style={{ margin: 0 }}>Haz clic en un país para ver la información del TSV.</p>
        ) : (
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>
              País seleccionado: {selectedCountry} — Registros: {selectedData.length}
            </p>
            {topViruses.length > 0 ? (
              <div style={{ marginTop: 6, opacity: 0.95 }}>
                <p style={{ margin: 0 }}>Virus y datasets (máx 10 virus, 5 datasets c/u):</p>
                <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                  {topViruses.map((v) => {
                    const list = Array.from(datasetsByVirus[v] || [])
                      .filter(Boolean)
                      .slice(0, 5);
                    return (
                      <li key={v} style={{ marginBottom: 2 }}>
                        <span style={{ fontWeight: 500 }}>{v}</span>: {list.length > 0 ? list.join(", ") : "sin dataset"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p style={{ margin: "6px 0 0 0", opacity: 0.9 }}>
                No hay campo de virus identificable en el TSV para este país.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Map container */}
      <div style={{ width: "100%", height: 650, background: "#111", borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ComposableMap
          projectionConfig={{ scale: 150 }}
          width={1200}
          height={600}
          style={{ width: "100%", height: "100%", background: "#111" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                .filter((geo) => {
                  const n =
                    geo.properties?.NAME ||
                    geo.properties?.name ||
                    geo.properties?.ADMIN ||
                    geo.properties?.admin;
                  return n && n !== "Antarctica";
                })
                .map((geo) => {
                  const countryName =
                    geo.properties?.NAME ||
                    geo.properties?.name ||
                    geo.properties?.ADMIN ||
                    geo.properties?.admin ||
                    geo.id;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => setSelectedCountry(countryName)}
                      style={{
                        default: {
                          fill: "#fff",
                          stroke: "#444",
                          strokeWidth: 0.7,
                          outline: "none",
                          cursor: "pointer",
                        },
                        hover: {
                          fill: "#e0e0e0",
                          stroke: "#222",
                          strokeWidth: 1.2,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#bdbdbd",
                          stroke: "#222",
                          strokeWidth: 1.2,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ComposableMap>
      </div>
      <div style={{ marginTop: 12 }}>
        {loading ? (
          <p>Cargando datos...</p>
        ) : selectedCountry ? (
          <p>
            País seleccionado: {selectedCountry} — Registros: {countryData[selectedCountry]?.length || 0}
          </p>
        ) : (
          <p>Haz clic en un país para ver la información.</p>
        )}
      </div>
    </div>
  );
}
