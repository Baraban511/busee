import { Button, Text, View, Image } from "react-native";
import React, { useEffect, useState } from 'react';
import { DateTime } from "luxon";
import Disruptions from "@/components/Disruptions";
export default function Retour() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={require('@/assets/images/logo.png')} />
      <Disruptions />
      <NextBus />
    </View>
  );
}

function NextBus() {
  const [busCountdown, setBusCountdown] = useState(0);
  const [dataFetchInterval, setDataFetchInterval] = useState(1000);


  const updateBusInterval = async () => {
    console.log("updateBusInterval");
    var busTime = await getNextBusArrival();
    if (busTime) {
      let busInterval = DateTime.fromMillis(busTime.diffNow("milliseconds").milliseconds);
      setBusCountdown(busInterval.toMillis());
      if (busInterval.minute < 0) {
        setDataFetchInterval(5000); //5 secondes
      }
      else {
        setDataFetchInterval(30000); //30 secondes
      }
      return;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBusCountdown((prevCountdown) => prevCountdown - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateBusInterval();
    }, dataFetchInterval);
    return () => clearInterval(interval);
  }, [dataFetchInterval]);

  return (<>
    <Text>Prochain bus dans {parseBusCountdown(busCountdown)}</Text>
    <Button title="Rafraichir" onPress={() => updateBusInterval()} /></>
  )
}

async function getNextBusArrival() { 
  let response = await fetch("https://sytral.api.instant-system.com/InstantCore/v4/networks/57/lines/line:tcl:C11/stopPoints/stop_point:tcl:SP:2701/schedules?duration=3600&dataFreshness=realtime&direction=OUTWARD");
  var nextBus = await response.json();
  if (nextBus.stopSchedules[0].dateTimes[0]) {
    return DateTime.fromISO(nextBus.stopSchedules[0].dateTimes[0].dateTime);
  }
  else {
    return undefined;
  }
}

function parseBusCountdown(millisecond: number) {
  var text = "";
  var duration = DateTime.fromMillis(millisecond);
  if (duration.minute < 0) {
    return "maintenant";
  }
  if (duration.minute > 0) {
    text += duration.minute + " minute" + (duration.minute > 1 ? "s " : " ");
  }
  if (duration.second > 0) {
    text += duration.second + " seconde" + (duration.second > 1 ? "s" : "");
  }
  return text;
}