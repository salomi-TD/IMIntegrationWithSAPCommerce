import React, { useState, useRef } from 'react';
import { View, TextInput, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Screens from './Screens';

const OTPVerify = (props) => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [text, setText] = useState(['', '', '', '', '', '']);
  let inputRefs = useRef([
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ]);

  const handleDigitChange = (index, newDigit) => {
    const newText = [...text];
    newText[index] = newDigit;
    setText(newText);

    if (newDigit && index < text.length - 1) {
      inputRefs.current[index + 1].current?.focus(); // Move focus to the next TextInput
    } else if (!newDigit && index > 0) {
      inputRefs.current[index - 1].current?.focus(); // Move focus to the previous TextInput
    }
  };

  const otpContent = (
    <View style={styles.containerStyle}>
      {text.map((digit, index) => (
        <TextInput
          key={index}
          ref={inputRefs.current[index]}
          style={[styles.textStyle, digit ? styles.filledStyle : {}]}
          value={digit}
          onChangeText={(newDigit) => handleDigitChange(index, newDigit)}
          keyboardType="number-pad"
          maxLength={1}
        />
      ))}
    </View>
  );

  const handleSendOTP = async () => {
    try {
      console.log('Submitting OTP:', text.join(''));
      const response = await axios.post(
        `http://10.0.2.2:8080/verify?otp=${text.join('')}`
      );
      setResponseData(response.data);
      setError(null);
    } catch (error) {
      setError('Error: ' + error.message);
      setResponseData(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      {otpContent}

      {responseData && <Text style={styles.msgStyle}>{responseData}</Text>}
      {error && <Text>{error}</Text>}
      {responseData === 'user Exists' || responseData === 'verifyed succsesfully' ? (
        <Screens Number={props.Number} />
      ) : (
        <TouchableOpacity onPress={handleSendOTP} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Verify & Register</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    height: 50,
    width: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 28,
    textAlign: 'center',
    paddingTop: 8,
  },
  filledStyle: {
    backgroundColor: '#d1d1d1',
    overflow: 'hidden',
  },
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeAreaStyle: {
    marginHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
  msgStyle: {
    fontSize: 20,
    paddingVertical: 10,
  },
});

export default OTPVerify;
