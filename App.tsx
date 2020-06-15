import React, { useEffect, useState, useCallback } from "react"
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
  Linking,
} from "react-native"
import tailwind from "tailwind-rn"
import Header from "./src/components/Header"
import { BarCodeScanner } from "expo-barcode-scanner"
import Scanner from "./src/components/Scanner"
import * as Types from "./src/utils/types"
import OpenCameraButton from "./src/components/OpenCameraButton"
import ContentList from "./src/components/ContentList"
import * as Common from "./src/utils/common"
import ModalContent from "./src/components/ModalContent"

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
    handleCopyContent: (): void => {
      Clipboard.setString(content.data)
      ToastAndroid.showWithGravity(
        "Content copied!",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      )
    },
    handleOpenLink: useCallback(async () => {
      if (await Linking.canOpenURL(content.data)) {
        await Linking.openURL(content.data)
      } else {
        Alert.alert(`Don't know how to open this URL: ${content.data}`)
      }
    }, [content.data]),
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
          <ModalContent
            content={content}
            handleCloseModal={handler.handleCloseModal}
            handleCopyContent={handler.handleCopyContent}
            handleOpenLink={handler.handleOpenLink}
            isOpenModal={isOpenModal}
          />
          <OpenCameraButton handleOpenCamera={() => setScanned(true)} />
        </View>
      )}
    </>
  )
}

export default App
