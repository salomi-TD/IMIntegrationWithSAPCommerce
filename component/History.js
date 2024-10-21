// History.js (Parent Component)
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import axios from 'axios';
import ImageList from './ImageList';

const History = (props) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [responseHistoryData, setresponseHistoryData] = useState([]);
  const [error, setError] = useState(null);

  const getHistory = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8080/history', {
        params: { phoneNumber: props.Number },
      });
      console.log(response.data);
      setresponseHistoryData(response.data);
      setError(null);
    } catch (error) {
      setresponseHistoryData([]);
      setError('Error: ' + error.message);
    }
  };


  return (
    <View>
      <Button title="History" onPress={getHistory} />
      <ImageList responseData={responseData} error={error} />
    </View>
  );
};

export default History;
