// DisplayBusinessesList.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';

export default function DisplayBusinessesList({ businesses }) {
  return (
    <ScrollView>
      <Text style={styles.subtitle}>עסקים</Text>
      <View style={styles.avatarContainer}>
        {businesses.map((business, index) => (
          <View key={index} style={styles.avatar}>
            <Image
              source={{ uri: business.imageUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 10, textAlign: 'right', marginRight: '3%' },
  avatarContainer: { flexDirection: 'row-reverse', flexWrap: 'wrap', marginTop: 10 },
  avatar: {
    width: 80,
    height: 70,
    borderRadius: 50,
    overflow: 'hidden',
    margin: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
});
