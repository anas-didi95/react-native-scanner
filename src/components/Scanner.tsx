import React from "react"
import { BarCodeScanner, BarCodeScannedCallback } from "expo-barcode-scanner"
import tailwind from "tailwind-rn"

const Scanner: React.FC<{ handleBarCodeScanned: BarCodeScannedCallback }> = ({
  handleBarCodeScanned,
}) => (
  <BarCodeScanner
    onBarCodeScanned={handleBarCodeScanned}
    style={tailwind("h-full")}
  />
)

export default Scanner
