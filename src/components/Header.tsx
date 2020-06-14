import React from "react"
import tailwind from "tailwind-rn"
import { View, Text } from "react-native"

const Header: React.FC<{}> = () => (
  <View style={tailwind("bg-purple-700")}>
    <Text style={tailwind("my-4 mx-6 text-white font-bold text-xl")}>
      React Native Scanner
    </Text>
  </View>
)

export default Header
