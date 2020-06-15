import React from "react"
import { Modal, View, Text, TouchableOpacity } from "react-native"
import tailwind from "tailwind-rn"
import * as Types from "../utils/types"

const ModalContent: React.FC<{
  isOpenModal: boolean
  handleCloseModal: any
  handleCopyContent: any
  handleOpenLink: any
  content: Types.IContent
}> = ({
  isOpenModal,
  handleCloseModal,
  handleCopyContent,
  handleOpenLink,
  content,
}) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={isOpenModal}
    onRequestClose={handleCloseModal}>
    <View
      style={tailwind(
        "flex flex-col flex-1 items-center justify-center bg-black"
      )}>
      <View
        style={{
          ...tailwind("border border-black w-4/5 bg-white rounded"),
          height: "35%",
        }}>
        <Text style={tailwind("mt-2 ml-2 font-semibold")}>{content.data}</Text>
        <View
          style={{
            ...tailwind(
              "flex flex-row justify-around bottom-0 absolute w-full"
            ),
            height: "40%",
          }}>
          <ModalButton handlePress={handleCopyContent} value="Copy content" />
          <ModalButton handlePress={handleOpenLink} value="Open link" />
          <ModalButton handlePress={handleCloseModal} value="Close" />
        </View>
      </View>
    </View>
  </Modal>
)

const ModalButton: React.FC<{ handlePress: any; value: string }> = ({
  handlePress,
  value,
}) => (
  <TouchableOpacity
    style={tailwind(
      "flex flex-row flex-1 justify-center bg-purple-500 rounded-lg items-center mx-1 my-2"
    )}
    onPress={handlePress}>
    <Text style={tailwind("text-white")}>{value}</Text>
  </TouchableOpacity>
)

export default ModalContent
