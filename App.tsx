import React from 'react';
import { SafeAreaView, Text, View, } from 'react-native';
import tailwind from "tailwind-rn"

const App = () => (
  <View style={tailwind('pt-6')}>
    <View style={tailwind('bg-purple-700')}>
      <Text style={tailwind('m-4 text-white font-bold text-xl')}>React Native Scanner</Text>
    </View>
  </View>
);

export default App
