// App.js
import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import ProductList from './ProductList';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import History from './History';
import { useRoute } from '@react-navigation/native';
import ImageList from './ImageList';
import Modal from 'react-native-modal';
import UrlResults from './UrlResults';

const Results = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isShowHistory, setisShowHistory] = useState(false);
  const [responseHistoryData, setresponseHistoryData] = useState([]);
  const [historyError, setHistoryError] = useState(null);

  const [responseData, setResponseData] = useState('upload Image');
  const [urlResponseData, setUrlResponseDataa] = useState('[]');
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const route = useRoute();
  const { Number } = route.params;

  const uploadImage = async () => {
    try {

      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      });

      const formData = new FormData();
      formData.append('file', {
        uri: image.path,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      setisShowHistory(false)
      const response = await axios.post(
        'http://10.0.2.2:8080/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setResponseData(response.data);
      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      setError('Image upload error: ' + error.message);
      setResponseData(null);
      console.log('Image upload error:', error);
    }
  };

  const openCameraLib = async () => {
    try {
      const options = {
        mediaType: 'photo', // Set the media type to 'photo' to capture images
        quality: 0.5, // Set the image quality
      };

      launchCamera(options, async response => {
        if (response.didCancel) {
          console.log('Image capture canceled');
        } else if (response.error) {
          console.log('Image capture error:', response.error);
        } else {
          const formData = new FormData();
          formData.append('file', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });

          try {
            setisShowHistory(false)
            const uploadResponse = await axios.post(
              'http://10.0.2.2:8080/upload',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              },
            );

            setResponseData(uploadResponse.data);
            console.log(
              'Captured Image uploaded successfully:',
              uploadResponse.data,
            );
          } catch (uploadError) {
            setError('Image upload error: ' + uploadError.message);
            setResponseData(null);
            console.log('Image upload error:', uploadError);
          }
        }
      });
    } catch (error) {
      console.log('Error opening camera:', error);
    }
  };
  
  

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleInput = (text) => {
    setInputValue(text);
  };

  const handleModalConfirm = () => {
    setisShowHistory(false)
    const urlToSend = `http://10.0.2.2:8080/submitURL?imageUrl=${encodeURIComponent(inputValue)}`;
  
    fetch(urlToSend, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit URL');
        }
        return response.json();
      })
      .then((data) => {
        // Assuming similarProducts is a function that handles the server response
        setUrlResponseDataa(data)
      })
      .catch((error) => {
        console.error('Error:', error.message);
      })
      .finally(() => {
        // Make sure to close the modal even if there is an error
        toggleModal();
      });
  };
  

  const parseSimilarProductsJSON = jsonString => {
    try {
      const parsedData = JSON.parse(jsonString);
      return parsedData;
    } catch (error) {
      return [];
    }
  };

  const getHistory = async () => {
    try {
      setisShowHistory(true)
      const response = await axios.get('http://10.0.2.2:8080/history', {
        params: { phoneNumber: Number },
      });
      setresponseHistoryData(response.data);
      setHistoryError(null);
    } catch (error) {
      setresponseHistoryData([]);
      setHistoryError('Error: ' + error.message);
    }
  };

  const similarProducts = parseSimilarProductsJSON(
    responseData?.similarProductsJSON,
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isShowHistory ? (
          <ImageList responseData={responseHistoryData} />

        ) : (
          <ProductList similarProducts={similarProducts}  urlResponseData = {urlResponseData}/>

        )}
         <UrlResults urlResponseData={urlResponseData}/>
      </View>
      <View style={styles.menu}>
      <View style={styles.buttonContainer}>
        
        <Button title="Upload Image" onPress={uploadImage} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Capture Image" onPress={openCameraLib} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="History" onPress={getHistory} />

      </View>

      <View style={styles.buttonContainer}>
      <Button title="Show Input" onPress={toggleModal} />

      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10, padding: 5 }}
            placeholder="Enter some text"
            value={inputValue}
            onChangeText={handleInput}
          />
          <Button title="Confirm" onPress={handleModalConfirm} />
          <Button title="Cancel" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  menu:{
    
    flexDirection: 'row',
    backgroundColor:'#ccc',
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
});

export default Results;
