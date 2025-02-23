import React, { useState, useEffect, useRef } from "react";

import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FAB } from "react-native-paper";
import chargersData from "../data/chargers.json";
import { Charger } from "../types/chargerTypes";



const Map: React.FC = () => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const mapRef = useRef<MapView | null>(null);

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

  const captureMapSnapshot = async () => {
    if (!mapRef.current || !location) {
      Alert.alert("Error", "Map or location not available");
      return;
    }

    try {
      const snapshot = await mapRef.current.takeSnapshot({
        width: 300,
        height: 300,
        format: "jpg",
        quality: 0.9,
        result: "file",
      });

      console.log("Map snapshot captured:", snapshot);
      Alert.alert("Success", `Snapshot saved at: ${snapshot}`);
    } catch (error) {
      console.error("Map snapshot capture failed:", error);
      Alert.alert("Error", "Failed to capture map snapshot");
    }
  };

  if (loading || !location) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          pinColor="pink"
        />

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

      <FAB style={styles.fab} icon="camera" onPress={captureMapSnapshot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "blue",
  },
});

export default Map;
