import { Stack } from 'expo-router'
import React from 'react'
import { Header } from 'react-native/Libraries/NewAppScreen'

const RootLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{
          headerTitle:"IRM",
        }}/>
        <Stack.Screen name="Stock/index" options={{
          headerTitle:"Stock",
        }}/>
          <Stack.Screen name="Stock/return" options={{
          headerTitle:"Return",
        }}/>
        <Stack.Screen name="Stock/PriceLinkPage" options={{
          headerTitle:"PriceLink",
        }}/>

    </Stack>
  )
}

export default RootLayout
