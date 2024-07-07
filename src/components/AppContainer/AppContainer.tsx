"use client";
import mqtt from "mqtt";
import Card from "../Card/Card";
import { useEffect, useState } from "react";

export default function AppContainer() {
  const [soilState, setSoilState] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const mqttClient = mqtt.connect(
        "wss://f888816e.ala.asia-southeast1.emqxsl.com:8084/mqtt",
        {
          username: "admin",
          password: "Admin123",
        },
      );

      mqttClient.on("connect", () => {
        mqttClient.subscribe("grokul/soil", (err) => {
          if (!err) {
            console.log("subscribed");
          } else {
            console.log(err);
          }
        });
      });

      mqttClient.on("message", async (topic, message) => {
        if (topic == "grokul/soil") {
          console.log(message.toString());
          setSoilState(Number(message));
        }
        mqttClient.end();
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClick = async () => {
    const mqttClient = mqtt.connect(
      "wss://f888816e.ala.asia-southeast1.emqxsl.com:8084/mqtt",
      {
        username: "admin",
        password: "Admin123",
      },
    );
    mqttClient.publish("grokul/tetes", "1", {
      retain: true,
    });
  };

  return (
    <>
      <div className="mt-4 grid w-full grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <Card title="Soil Humidity Status">
          <p
            className={`${soilState > 60 ? "text-success" : soilState > 30 ? "text-warning" : "text-danger"} text-2xl font-bold`}
          >
            {soilState}%
          </p>
        </Card>
        <Card title="Trigger Water">
          <button
            className="inline-flex items-center justify-center rounded-full bg-lime-500 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            onClick={handleClick}
          >
            Trigger
          </button>
        </Card>
      </div>
    </>
  );
}
