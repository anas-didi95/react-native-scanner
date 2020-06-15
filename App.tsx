import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  BackHandler,
  Alert,
  Modal,
  Button,
  TouchableOpacity,
} from "react-native"
import tailwind from "tailwind-rn"
import Header from "./src/components/Header"
import { BarCodeScanner } from "expo-barcode-scanner"
import Scanner from "./src/components/Scanner"
import * as Types from "./src/utils/types"
import OpenCameraButton from "./src/components/OpenCameraButton"
import ContentList from "./src/components/ContentList"
import * as Common from "./src/utils/common"

const App: React.FC<{}> = () => {
  const [hasPermission, setPermission] = useState("")
  const [isScanned, setScanned] = useState(false)
  const [contentList, setContentList] = useState<Types.IContent[]>([])
  const [isOpenModal, setOpenModal] = useState(false)

  const handler = {
    handleBarCodeScanned: ({ type, data }: Types.IQrHandler) => {
      setScanned(false)
      alert(`Bar code with type ${type} and data ${data} has been scanned!`)
      setContentList((prev) => [
        ...prev,
        {
          key: Common.generateUUID(),
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
          <Button onPress={() => setOpenModal(true)} title="Test Modal" />
          <Header />
          <ContentList contentList={contentList} />
          <View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={isOpenModal}
              onRequestClose={() => setOpenModal(false)}>
              <View
                style={tailwind(
                  "flex flex-col flex-1 items-center justify-center bg-black"
                )}>
                <View
                  style={{
                    ...tailwind("border border-black w-4/5 bg-white rounded"),
                    height: "35%",
                  }}>
                  <Text style={tailwind("mt-2 ml-2 font-semibold")}>
                    Hello World
                  </Text>
                  <View
                    style={{
                      ...tailwind(
                        "flex flex-row justify-around bottom-0 absolute w-full"
                      ),
                      height: "40%",
                    }}>
                    <TouchableOpacity
                      style={tailwind(
                        "flex flex-row flex-1 justify-center bg-purple-500 rounded-lg items-center mx-1 my-2"
                      )}>
                      <Text style={tailwind("text-white")}>Copy content</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tailwind(
                        "flex flex-row flex-1 justify-center bg-purple-500 rounded-lg items-center mx-1 my-2"
                      )}>
                      <Text style={tailwind("text-white")}>Open link</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tailwind(
                        "flex flex-row flex-1 justify-center bg-purple-500 rounded-lg items-center mx-1 my-2"
                      )}>
                      <Text style={tailwind("text-white")}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <OpenCameraButton handleOpenCamera={() => setScanned(true)} />
        </View>
      )}
    </>
  )
}

export default App
