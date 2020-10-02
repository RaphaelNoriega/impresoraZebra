

import React,{useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  NativeModules,
  Alert,
  Platform,
  Button,
  ActivityIndicator,
  Flatlist
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

//import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';
//import RNZebraBluetoothPrinter from './node_modules/react-native-zebra-bluetooth-printer';
const zpl = "^XA ^FO10 ^BQ,2,9^FDQA,1244578deuceucbecuycjbdycdhcbyyyxyevkjdhdgmvnvh4545121buscbdcbdkcdcdcgdcydgcdycgdciuydgcdiuyc5785 ^FS ^XZ";
const deviceAddress = '00:17:E9:D1:74:43'
const App = () => {
const [devices,setDeviceArray] = useState([]);
const [loading,toggleLoading] = useState(false);
const [deviceType,setDeviceType] = useState('');
  return (
   
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
            <View style={{
            paddingLeft:60,
            flexDirection:'column',
            justifyContent: 'center',
            backgroundColor:'#58d68d',
            
            }}>
              <Text style={{fontSize:30,}}>Impresora zebra</Text>
              <Text style={{fontSize:20,}}>Agua de hermosillo</Text>
              <Text style={{fontSize:20,}}>Facturacion en Sitio</Text>
            </View>
          <View style={styles.body}>
            <Button
            color='#ff6f00'
              title="Bluetooth on"
              onPress={() => {
                NativeModules.RNZebraBluetoothPrinter.enableBluetooth().then(res => {
                  console.log(res);
                });
              }}
            ></Button>
            <Button
            color='#ff6f00'
            title="Bluetooth off"
            onPress={()=>{
              NativeModules.RNZebraBluetoothPrinter.disableBluetooth().then(res=>{  
              console.log(res);
              });
            }}
            ></Button>
            </View>
          <View>
            <Button
            color='#ff6f00'
            title="Dispositivos emparejados"
              onPress={() => {
                toggleLoading(true);
                NativeModules.RNZebraBluetoothPrinter.pairedDevices().then(res => {
                  setDeviceArray(res); 
                  setDeviceType('paired');                      //filter array for printers [class:1664]
                  toggleLoading(false);
                });
              }}
            ></Button>
            <View style={{padding:10}}></View>
            <Button
            color='#ff6f00'
            title="Dispositivos no emparejados"
              onPress={() => {
                toggleLoading(true);
                  NativeModules.RNZebraBluetoothPrinter.scanDevices().then(res => {
                    console.log(res);
                    if(Platform.OS == 'ios') {
                      var found = JSON.parse(res.found);  //filter array for printers [class:1664]
                    }
                    else {
                      var devices = JSON.parse(res);
                      var found = devices.found;
                    }
                    setDeviceType(''); 
                    setDeviceArray(found); 
                    toggleLoading(false);
                  });
               
              }}
            ></Button>
          </View>
      
       {
         loading == true?<ActivityIndicator size="large" color="#2196f3"/>:
         devices.map((device)=>
           
            <View style={{
              flexDirection:'row',
              padding:20,
              justifyContent:'center'
            }}>
                <View style={{
                  flex:0.4
                }}>
                  <Text>{device.name}</Text>
                </View>
                <View style={{
                  flex:0.3
                }}>
                <Text>{device.address}</Text>
                </View>
                {device.type !='paired' &&
                 <View>
                   <Button
                   color='#ffa000'
                   title="Conectar"
                   onPress={()=>{
                    NativeModules.RNZebraBluetoothPrinter.connectDevice(device.address).then(res=>alert(res));
                     alert(device.address)
                   }}></Button>
                 </View>}

                 
            </View>
         )}

              <View style={{marginTop:50}}>
                <Button
                color='#00cc00'
                title="imprimir"
                onPress={()=>{
                  NativeModules.RNZebraBluetoothPrinter.print(deviceAddress,zpl).then((res) => {
                  alert(res)
                })
                }}></Button>
              </View>

      </ScrollView>
      </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    padding:30,
    flexDirection:'row',
    justifyContent:'space-evenly'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
