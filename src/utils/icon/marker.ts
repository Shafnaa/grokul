import L from "leaflet";
import motor from "../../../public/images/icon/motor.svg";

const iconMotor = new L.Icon({
  iconUrl: motor.src,
  //   iconRetinaUrl: motor,
  iconAnchor: new L.Point(50, 55),
  //   popupAnchor: null,
  //   shadowUrl: null,
  //   shadowSize: null,
  //   shadowAnchor: null,
  iconSize: new L.Point(60, 60),
  //   className: "leaflet-div-icon",
});

export { iconMotor };
