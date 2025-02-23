import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import chargersData from "../data/chargers.json"

type Charger = {
  name: string;
  id: string;
  address: string;
  distance: string;
  distance_metrics: string;
  latitude: string;
  longitude: string;
  connector_types: string[];
};

const Map: React.FC = () => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied"
        );
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location!.latitude,
        longitude: location!.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* User's LOCATION MARKER */}
      <Marker
        coordinate={{
          latitude: location!.latitude,
          longitude: location!.longitude,
        }}
        title="You are here"
        pinColor="pink"
      />

      {/* CHARGING STATIONS FROM JSON */}
      {chargersData.chargers.map((charger: Charger, index: number) => (
        <Marker
          key={index}
          coordinate={{
            latitude: parseFloat(charger.latitude),
            longitude: parseFloat(charger.longitude),
          }}
          title={charger.name}
          description={charger.address}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default Map;
