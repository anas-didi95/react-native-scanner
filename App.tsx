import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  BackHandler,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native"
import tailwind from "tailwind-rn"
import Header from "./src/components/Header"
import { BarCodeScanner } from "expo-barcode-scanner"
import Scanner from "./src/components/Scanner"
import * as Types from "./src/utils/types"
import OpenCameraButton from "./src/components/OpenCameraButton"

interface IContent {
  key: string
  type: string
  data: string
}

const App: React.FC<{}> = () => {
  const [hasPermission, setPermission] = useState("")
  const [isScanned, setScanned] = useState(false)
  const [contentList, setContentList] = useState<IContent[]>([])

  const handler = {
    handleBarCodeScanned: ({ type, data }: Types.IQrHandler) => {
      setScanned(false)
      alert(`Bar code with type ${type} and data ${data} has been scanned!`)
      setContentList((prev) => [
        ...prev,
        {
          key: new Date().getMilliseconds().toString(),
          type: type,
          data: data,
        },
      ])
    },
    handleBackAction: (): boolean => {
      Alert.alert("Exit", "Choose your option", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
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
          <View
            style={{
              height: "80%",
            }}>
            <FlatList
              data={contentList}
              renderItem={({ item }) => (
                <View
                  key={`list${item.key}`}
                  style={tailwind(
                    "flex flex-row mx-4 mt-4 border border-black"
                  )}>
                  <TouchableOpacity
                    style={tailwind("p-4 flex flex-row flex-1")}
                    onPress={() => console.log(item)}>
                    <Text>{item.data}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <OpenCameraButton handleOpenCamera={() => setScanned(true)} />
        </View>
      )}
    </>
  )
}

export default App
