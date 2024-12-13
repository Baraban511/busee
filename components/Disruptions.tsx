import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import RenderHtml from '@builder.io/react-native-render-html';
import { useWindowDimensions } from 'react-native';

export default function Disruptions() {
  const { width } = useWindowDimensions();
  const [disruptionsMessage, setDisruptionsMessage] = useState("loading...");

  const getDisruptions = async () => {
    try {
      let response = await fetch("https://sytral.api.instant-system.com/InstantCore/v4/networks/57/lines/line:tcl:C11/stopPoints/stop_point:tcl:SP:48329/schedules?duration=3600&dataFreshness=realtime&direction=RETURN");
      let disruptions = await response.json();
      if (disruptions.disruptions && disruptions.disruptions.length > 0) {
        setDisruptionsMessage(disruptions.disruptions[0].messages[0].translations[0].content);
      } else {
        setDisruptionsMessage("Pas d'alerte trafic !");
      }
    } catch (error) {
      console.error(error);
      setDisruptionsMessage("Erreur lors de la récupération des données.");
    }
  };

  useEffect(() => {
    getDisruptions();
  }, []); // Utiliser un tableau de dépendances vide

  return (
    <View>
      <RenderHtml contentWidth={width} source={{ html: disruptionsMessage }} />
    </View>
  );
}