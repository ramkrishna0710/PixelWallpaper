import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PixelWallpapers from './src/screens/PixelWallpapers';

const queryClinet = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClinet}>
      <View style={styles.container}>
        <PixelWallpapers/>
      </View>
    </QueryClientProvider>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center'
  }
})