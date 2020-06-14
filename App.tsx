import React from 'react';
import { SafeAreaView, Text, View, } from 'react-native';
import tailwind from "tailwind-rn"
import Header from './src/components/Header';

const App: React.FC<{}> = () => (
  <View style={tailwind('pt-6')}>
    <Header />
  </View>
);

export default App
