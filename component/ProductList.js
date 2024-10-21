
import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Linking,
  TouchableOpacity,
} from 'react-native';

const ProductList = ({ similarProducts, error }) => {
  return (
    <View>
      {similarProducts && Array.isArray(similarProducts) ? (
        <FlatList
          data={similarProducts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View>
              <Image
                source={{ uri: item.images[0] }}
                style={{ width: 100, height: 100 }}
              />
              <Text>Brand: {item.brand_name}</Text>
              <Text>Name: {item.name}</Text>
              <Text>Price: {item.price}</Text>
              <Text>url: {item.url}</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://google.com')}>
                <Text> Click Here </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>{error}</Text>
      )}
    </View>
  );
};

export default ProductList;
