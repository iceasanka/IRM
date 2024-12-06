import { Link, router } from 'expo-router'
import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { StyleSheet, Button, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const Separator = () => <View style={styles.separator} />;

const HomePage = () => {
  return (



    <View>
      <Text>IRM</Text>

      <Button title='Add/Update Stock' onPress={() => router.push("/Stock")}>
      </Button>

      <Separator />

      <Button title='Return Stock' onPress={() => router.push("/Stock/return")}></Button>

    </View>




  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});


export default HomePage
