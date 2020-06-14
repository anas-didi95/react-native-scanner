import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  Button,
  BackHandler,
  Alert,
} from "react-native"
import tailwind from "tailwind-rn"
import Header from "./src/components/Header"
import { BarCodeScanner } from "expo-barcode-scanner"

interface IQrHandler {
  type: string
  data: string
}

const App: React.FC<{}> = () => {
  const [hasPermission, setPermission] = useState("")
  const [isScanned, setScanned] = useState(false)

  const handleBarCodeScanned = ({ type, data }: IQrHandler) => {
    setScanned(false)
    alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    console.log("Scan success")
  }

  const handleBackAction = (): boolean => {
    Alert.alert("Exit", "Choose your option", [
      { text: "Cancel", onPress: () => null },
      { text: "List", onPress: () => setScanned(false) },
      { text: "Close app", onPress: () => BackHandler.exitApp() },
    ])
    return true
  }

  useEffect(() => {
    ;(async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setPermission(status)
    })()

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction
    )

    return () => backHandler.remove()
  }, [])

  if (hasPermission === "") {
    return <Text>Requesting for camera permission</Text>
  } else if (!hasPermission) {
    return <Text>No access to camera</Text>
  }

  return (
    <>
      {isScanned ? (
        <View style={tailwind("h-full")}>
          <BarCodeScanner
            onBarCodeScanned={isScanned ? handleBarCodeScanned : () => null}
            style={tailwind("h-full")}
          />
        </View>
      ) : (
        <View style={tailwind("h-full pt-6")}>
          <Header />
          {!isScanned && (
            <Button
              title={"Tap to Scan Again"}
              onPress={() => setScanned(true)}
            />
          )}
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000", // the rock-solid workaround
  },
})

export default App
