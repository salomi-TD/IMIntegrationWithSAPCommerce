import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, Image } from 'react-native';

const UrlResults = ({ urlResponseData }) => {
  console.log('Hey response' + urlResponseData);

  return (
    <View>
      <FlatList
        data={urlResponseData}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={({ item }) => (
          <View>
            {/* Display the image in an Image tag */}
            <Image style={{ width: 100, height: 100 }} source={{ uri: item.images[0] }} />

            <Text>{item.name}</Text>
            <Text>Brand: {item.brand_name}</Text>
            <Text>Price: {item.price} {item.currency}</Text>
            {/* Remove duplicate image display */}
            {/* <Text>Image: {item.images[0]} {item.images[0]}</Text> */}

            {item.url && (
              <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                <Text>View Details</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default UrlResults;
