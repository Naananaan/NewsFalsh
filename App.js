import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TextInput, Button } from 'react-native';
import axios from 'axios';
import { API_KEY } from '@env'; // Ensure you have configured react-native-dotenv

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArticles = async (query) => {
    const SEARCH_URL = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
    try {
      const response = await axios.get(query ? SEARCH_URL : `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
      setArticles(response.data.articles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(''); // Initial fetch for top headlines
  }, []);

  if (!API_KEY) {
    return <Text>Error: API Key is missing!</Text>;
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  // Trigger search when the user presses the button
  const handleSearch = () => {
    if (searchQuery) {
      setLoading(true);
      fetchArticles(searchQuery); // Fetch articles based on the search query
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search articles..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      {articles.length === 0 && searchQuery ? (
        <Text>No articles found for "{searchQuery}"</Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <View style={styles.article}>
              {item.urlToImage ? (
                <Image source={{ uri: item.urlToImage }} style={styles.image} />
              ) : (
                <Text>No image available</Text>
              )}
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  article: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default App;
