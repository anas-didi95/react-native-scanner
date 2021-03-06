import React from "react"
import { View, FlatList, TouchableOpacity, Text } from "react-native"
import tailwind from "tailwind-rn"
import * as Types from "../utils/types"

const ContentList: React.FC<{
  contentList: Types.IContent[]
  onPressContent: any
}> = ({ contentList, onPressContent }) => (
  <View
    style={{
      height: "80%",
    }}>
    <FlatList
      data={contentList}
      renderItem={({ item, index }) => (
        <View
          key={`list${item.key}`}
          style={tailwind("flex flex-row mx-4 mt-4 border border-black")}>
          <TouchableOpacity
            style={tailwind("p-4 flex flex-row flex-1")}
            onPress={() => onPressContent(index)}>
            <Text>{item.data}</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
)

export default ContentList
