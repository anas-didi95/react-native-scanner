import React from "react"
import { View, TouchableOpacity, Text } from "react-native"
import tailwind from "tailwind-rn"

const OpenCameraButton: React.FC<{ handleOpenCamera: any }> = ({
  handleOpenCamera,
}) => (
  <View
    style={tailwind(
      "flex flex-row justify-center absolute inset-x-0 bottom-0 bg-gray-300"
    )}>
    <TouchableOpacity
      onPress={handleOpenCamera}
      style={tailwind("flex flex-row justify-center")}>
      <View
        style={tailwind(
          "flex flex-row justify-center items-center bg-purple-500 rounded-lg w-3/4 h-10 m-2"
        )}>
        <Text style={tailwind("text-white")}>Open Camera</Text>
      </View>
    </TouchableOpacity>
  </View>
)

export default OpenCameraButton
