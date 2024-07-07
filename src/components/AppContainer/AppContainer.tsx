"use client";
import mqtt from "mqtt";
import Card from "../Card/Card";
import { useEffect, useState } from "react";

export default function AppContainer() {
  const [soilState, setSoilState] = useState<number>(0);
  const [topThresholdState, setTopThresholdState] = useState<number>(0);
  const [botThresholdState, setBotThresholdState] = useState<number>(0);

  useEffect(() => {
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
      mqttClient.subscribe("grokul/threshold/top", (err) => {
        if (!err) {
          console.log("subscribed");
        } else {
          console.log(err);
        }
      });
      mqttClient.subscribe("grokul/threshold/bottom", (err) => {
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
      } else if (topic == "grokul/threshold/top") {
        console.log(message.toString());
        setTopThresholdState(Number(message));
      } else if (topic == "grokul/threshold/bottom") {
        console.log(message.toString());
        setBotThresholdState(Number(message));
      }
    });
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

  const handleTopThreshold = async (e: any) => {
    e.preventDefault();

    const mqttClient = mqtt.connect(
      "wss://f888816e.ala.asia-southeast1.emqxsl.com:8084/mqtt",
      {
        username: "admin",
        password: "Admin123",
      },
    );

    mqttClient.publish("grokul/threshold/top", topThresholdState.toString(), {
      retain: true,
    });
  };

  const handleBotThreshold = async (e: any) => {
    e.preventDefault();

    const mqttClient = mqtt.connect(
      "wss://f888816e.ala.asia-southeast1.emqxsl.com:8084/mqtt",
      {
        username: "admin",
        password: "Admin123",
      },
    );

    mqttClient.publish(
      "grokul/threshold/bottom",
      botThresholdState.toString(),
      {
        retain: true,
      },
    );
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

        <Card title="Setup Top Threshold">
          <form
            onSubmit={handleTopThreshold}
            className="flex flex-col items-center"
          >
            <input
              type="number"
              min={botThresholdState}
              max={100}
              className="border-gray-300 h-10 w-24 rounded-lg border text-center focus:outline-none focus:ring focus:ring-lime-500"
              value={topThresholdState}
              onChange={(e) => {
                setTopThresholdState(Number(e.target.value));
              }}
            />
            <button className="mt-4 inline-flex items-center justify-center rounded-full bg-lime-500 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
              Set
            </button>
          </form>
        </Card>
        <Card title="Setup Bottom Threshold">
          <form
            onSubmit={handleBotThreshold}
            className="flex flex-col items-center"
          >
            <input
              type="number"
              min={0}
              max={topThresholdState}
              className="border-gray-300 h-10 w-24 rounded-lg border text-center focus:outline-none focus:ring focus:ring-lime-500"
              value={botThresholdState}
              onChange={(e) => {
                setBotThresholdState(Number(e.target.value));
              }}
            />
            <button className="mt-4 inline-flex items-center justify-center rounded-full bg-lime-500 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
              Set
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
