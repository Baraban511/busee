import { Button, Text, View, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from 'react';
import RenderHtml from '@builder.io/react-native-render-html';
import { DateTime } from "luxon";

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
  const [nextBusTime, setNextBusTime] = useState("loading...");

  const getNextBus = async () => {
    var nextBus = await fetch("https://sytral.api.instant-system.com/InstantCore/v4/networks/57/lines/line:tcl:C11/stopPoints/stop_point:tcl:SP:48329/schedules?duration=3600&dataFreshness=realtime");
    nextBus = await nextBus.json();
    if (nextBus.stopSchedules[0].dateTimes[0]) {
      let busTime = DateTime.fromISO(nextBus.stopSchedules[0].dateTimes[0].dateTime);
      if (Math.round(busTime.diffNow("minutes").minutes) < 1) {
        busTime = Math.round(busTime.diffNow("seconds").seconds) + " secondes";
      }
      else {
        busTime = Math.round(busTime.diffNow("minutes").minutes) + " minutes";
      }
      setNextBusTime(busTime);
    }
    else {
      setNextBusTime("erreur");
    }
  }
  useEffect(() => {
    getNextBus();
  }, []);
  return (<>
    <Text>Prochain bus dans {nextBusTime}</Text>
    <Button title="Rafraichir" onPress={() => getNextBus()} /></>
  )
}