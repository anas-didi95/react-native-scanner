import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  BackHandler,
  Alert,
  Modal,
  Button,
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
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
  const [content, setContent] = useState<Types.IContent>({
    data: "",
    key: "",
    type: "",
  })

  const handler = {
    handleBarCodeScanned: ({ type, data }: Types.IQrHandler) => {
      let content: Types.IContent = {
        key: Common.generateUUID(),
        type: type,
        data: data,
      }
      setScanned(false)
      setContent(content)
      setContentList((prev) => [...prev, content])
      handler.handleOpenModal()
    },
    handleBackAction: (): boolean => {
      Alert.alert("Exit", "Choose your option", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "List", onPress: () => setScanned(false) },
        { text: "Close app", onPress: () => BackHandler.exitApp() },
      ])
      return true
    },
    handleOpenModal: (): void => setOpenModal(true),
    handleCloseModal: (): void => setOpenModal(false),
    handlePressContent: (index: number): void => {
      setContent(contentList[index])
      handler.handleOpenModal()
    },
    handleCopyContent: (content: string): void => {
      Clipboard.setString(content)
      ToastAndroid.showWithGravity(
        "Content copied!",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      )
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
          <ContentList
            contentList={contentList}
            onPressContent={handler.handlePressContent}
          />
          <View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={isOpenModal}
              onRequestClose={handler.handleCloseModal}>
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
                    {content.data}
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
                      )}
                      onPress={() => handler.handleCopyContent(content.data)}>
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
                      )}
                      onPress={handler.handleCloseModal}>
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
