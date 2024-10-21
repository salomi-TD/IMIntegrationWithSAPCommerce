import React, { useState } from 'react';
import { View, Button, Text, TextInput } from 'react-native';
import axios from 'axios';
import { ImageBackground, StyleSheet, Image } from 'react-native';
import OTPVerify from './otpVerify';


const Home = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberLegnth, setnumberLegnth] = useState(10);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://10.0.2.2:8080/logIn?phone=${phoneNumber}`);
      setResponseData(response.data);
      setError(null);
    } catch (error) {
      setResponseData(null);
      setError('Error: ' + error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    > 
      <ImageBackground
          source={{ uri: 'https://ik.imagekit.io/Vijay69/blob-01_5Bf88tC8E.png?updatedAt=1697712437713' }}
          style={styles.backgroundImage}>
            <Text style={{ paddingVertical:30, }}>Welcome to WardrobeWizard</Text>
            <View style={styles.imageContainer}>
         
         <Image
           style={styles.logo}
           source={{
             uri: 'https://ik.imagekit.io/Vijay69/image_h1TQ5wOcA.png?updatedAt=1695987806259',
           }}
         />
       </View>
       <View style={styles.logContainer}>
       <View style={styles.logContainerg}>
       <Text style={{ paddingVertical:10, textAlign:'left' }}>Enter 10 digit NUmber</Text>
       </View>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        keyboardType="number-pad"
        maxLength={numberLegnth}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />{
        phoneNumber.length === 10 && (
          <Button title="Send OTP" onPress={handleLogin} />
        )
      }
    
      <Text>{responseData || error}</Text>
      {
        responseData?<OTPVerify Number = {phoneNumber}/>:null
       
      }
      </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' depending on your needs
    width: '100%',
    height: '100%',
    //justifyContent: 'center',
    alignItems: 'center',
  },
  logContainer: {
  
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 280,
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  logo: {
    width: 249,
    height: 78,
    marginBottom: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    backgroundColor: '#fff',
    marginBottom:10,
  },
});
export default Home;
