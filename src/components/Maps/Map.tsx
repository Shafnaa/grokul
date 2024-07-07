"use client";

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { createClient } from "@supabase/supabase-js";
import { Map as MapLeaflet } from "leaflet";
import SwitcherTwo from "../Switchers/SwitcherTwo";
import DarkModeSwitcher from "../Header/DarkModeSwitcher";
import EngineSwitcher from "../Switchers/EngineSwitcher";
import { createSupabase } from "@/utils/supabase/client";
import { iconMotor } from "@/utils/icon/marker";

interface Location {
  latitude: number;
  longitude: number;
}

const SetView = ({ latitude, longitude }: any) => {
  const map: MapLeaflet = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), { animate: true });
    console.log("perbarui latlng : ", latitude, longitude);
  }, [latitude, longitude]);
  return null;
};

export default function Map(props: any) {
  const { position, zoom, onMessage } = props;

  const [location, setLocation] = useState<any>([0, 0]);
  const [locations, setLocations] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const supabase = createSupabase();

      const { data } = await supabase
        .from("coords")
        .select()
        .order("created_at");

      if (data != null && data.length != 0) {
        setLocations(data.map((item: any) => [item.latitude, item.longitude]));
        setLocation([
          data[data.length - 1].latitude,
          data[data.length - 1].longitude,
        ]);
      }

      supabase
        .channel("gps-tracker")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "coords" },
          ({ new: newData }) => {
            setLocations((prev: any) => [
              ...prev,
              [newData.latitude, newData.longitude],
            ]);
            setLocation([newData.latitude, newData.longitude]);
          },
        )
        .subscribe();

      supabase
        .channel("custom-delete-channel")
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "coords" },
          (payload) => {
            setLocation([0, 0]);
            setLocations([]);
          },
        )
        .subscribe();
    })();
  }, []);

  return (
    <>
      <MapContainer
        center={location}
        zoom={zoom}
        className="col-span-12 h-150"
        maxZoom={50}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={location} icon={iconMotor}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Polyline positions={locations} color="red" />
        <SetView latitude={location[0]} longitude={location[1]} />

        {/* <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
      </MapContainer>
    </>
  );
}
