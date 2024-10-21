import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Linking } from 'react-native';

const ImageList = ({ responseData, error }) => {
  const [linkResponseData, setLinkResponseData] = useState([]);

  const renderItem = ({ item }) => (
    <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: 'gray' }}>
        <Image
                source={{ uri: item.images[0] }}
                style={{ width: 100, height: 100 }}
              />
      <Text>Brand: {item.brand_name || 'N/A'}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Price: {item.price}</Text>
      <Text>URL: {item.url}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Text>Click Here</Text>
      </TouchableOpacity>
    </View>
  );

  const handleImageClick = (imageUrl) => {
    const urlToSend = `http://10.0.2.2:8080/submitURL?imageUrl=${encodeURIComponent(imageUrl)}`;

    fetch(urlToSend, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit URL');
        }
        return response.json();
      })
      .then((data) => {
        setLinkResponseData(data);
        console.log('Server response:', data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  };

  return (
    <View>
      <FlatList
        data={linkResponseData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View>
        {responseData.map((imageUrl, index) => (
          <TouchableOpacity key={index} onPress={() => handleImageClick(imageUrl)}>
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 200, height: 200, margin: 5 }}
            />
          </TouchableOpacity>
        ))}
        {error && <Text>{error}</Text>}
      </View>
    </View>
  );
};

export default ImageList;
