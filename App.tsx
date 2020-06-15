import React, { useEffect, useState } from "react"
import { Text, View, Button, BackHandler, Alert } from "react-native"
import tailwind from "tailwind-rn"
import Header from "./src/components/Header"
import { BarCodeScanner } from "expo-barcode-scanner"
import Scanner from "./src/components/Scanner"
import * as Types from "./src/utils/types"

const App: React.FC<{}> = () => {
  const [hasPermission, setPermission] = useState("")
  const [isScanned, setScanned] = useState(false)

  const handler = {
    handleBarCodeScanned: ({ type, data }: Types.IQrHandler) => {
      setScanned(false)
      alert(`Bar code with type ${type} and data ${data} has been scanned!`)
      console.log("Scan success")
    },
    handleBackAction: (): boolean => {
      Alert.alert("Exit", "Choose your option", [
        { text: "Cancel", onPress: () => null },
        { text: "List", onPress: () => setScanned(false) },
        { text: "Close app", onPress: () => BackHandler.exitApp() },
      ])
      return true
    },
  }

  useEffect(() => {
    ;(async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setPermission(status)
    })()

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handler.handleBackAction
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
          <Scanner handleBarCodeScanned={handler.handleBarCodeScanned} />
        </View>
      ) : (
        <View style={tailwind("h-full pt-6")}>
          <Header />
          {!isScanned && (
            <View
              style={tailwind(
                "absolute inset-x-0 bottom-0 rounded w-2/4 justify-center flex h-16"
              )}>
              <Button
                title={"Tap to Scan Again"}
                onPress={() => setScanned(true)}
              />
            </View>
          )}
        </View>
      )}
    </>
  )
}

export default App
