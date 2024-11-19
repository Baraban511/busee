import { Button, Text, View, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from 'react';
import RenderHtml from '@builder.io/react-native-render-html';
import { DateTime } from "luxon";
import { parse } from "@babel/core";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Disruptions />
      <NextBus />
    </View>
  );
}

function Disruptions() {
  const { width } = useWindowDimensions();
  const [disruptionsMessage, setDisruptionsMessage] = useState("loading...");
  const getDisruptions = async () => {
    var disruptions = await fetch("https://sytral.api.instant-system.com/InstantCore/v4/networks/57/disruptions?channelType=MOBILE&entityIds=line:tcl:C11");
    disruptions = await disruptions.json();
    if (disruptions.disruptions[0]) {
      setDisruptionsMessage(disruptions.disruptions[0].messages[0].translations[0].content);
    }
    else {
      setDisruptionsMessage("Pas d'alerte trafic !");
    }
  }
  useEffect(() => {
    getDisruptions();
  }, []);
  return (<RenderHtml
    contentWidth={width}
    source={{ html: disruptionsMessage }}
  />)
}

function NextBus() {

  const [nextBusInterval, setNextBusInterval] = useState("loading...");
  const [fetchInterval, setFetchInterval] = useState(60000);

  function parseTime(time: DateTime) {
    var text = "";
    if (time.minute > 0) {
      text += time.minute + "min ";
    }
    if (time.second > 0) {
      text += time.second + "s";
    }
    return text;
  }

  const updateBusTime = async () => {
    var busTime = await getNextBusArrival();
    if (busTime) {
      var busInterval = DateTime.fromMillis(busTime.diffNow("milliseconds").milliseconds);
      setNextBusInterval(parseTime(busInterval));
      if (busInterval.minute < 2) {
        setFetchInterval(1000); //Une seconde
      }
      else {
        setFetchInterval(60000); //Une minute
      }
      return;
    }
    setNextBusInterval("pas de bus");
  };

  useEffect(() => {
    updateBusTime();
    const interval = setInterval(() => {
      updateBusTime();
    }, fetchInterval);
    return () => clearInterval(interval);
  }, []);

  return (<>
    <Text>Prochain bus dans {nextBusInterval}</Text>
    <Button title="Rafraichir" onPress={() => updateBusTime()} /></>
  )
}

async function getNextBusArrival() {
  var nextBus = await fetch("https://sytral.api.instant-system.com/InstantCore/v4/networks/57/lines/line:tcl:C11/stopPoints/stop_point:tcl:SP:48329/schedules?duration=3600&dataFreshness=realtime");
  nextBus = await nextBus.json();
  if (nextBus.stopSchedules[0].dateTimes[0]) {
    return DateTime.fromISO(nextBus.stopSchedules[0].dateTimes[0].dateTime);
  }
  else {
    return undefined;
  }
}