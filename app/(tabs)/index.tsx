import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { getMoviesByStatus, Movie } from '../../db/dao';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'Now Showing' | 'Coming Soon'>('Now Showing');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getMoviesByStatus(activeTab).then(setMovies);
  }, [activeTab]);

  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity style={styles.movieCard} onPress={() => router.push(`/movie/${item.id}`)}>
      <Image source={{ uri: item.posterUrl }} style={styles.poster} />
      <Text style={styles.movieTitle}>{item.title}</Text>
      <Text style={styles.movieInfo}>{item.duration} mins</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies by title..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Now Showing' && styles.activeTab]}
          onPress={() => setActiveTab('Now Showing')}>
          <Text style={[styles.tabText, activeTab === 'Now Showing' && styles.activeTabText]}>Now Showing</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Coming Soon' && styles.activeTab]}
          onPress={() => setActiveTab('Coming Soon')}>
          <Text style={[styles.tabText, activeTab === 'Coming Soon' && styles.activeTabText]}>Coming Soon</Text>
        </TouchableOpacity>
      </View>
      <FlatList 
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovie}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No movies found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 10, borderRadius: 8, paddingHorizontal: 10, elevation: 2 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 40 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', elevation: 2 },
  tab: { flex: 1, padding: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#e91e63' },
  tabText: { fontSize: 16, fontWeight: 'bold', color: '#666' },
  activeTabText: { color: '#e91e63' },
  movieCard: { flex: 1, margin: 8, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', elevation: 2 },
  poster: { width: '100%', height: 250, resizeMode: 'cover' },
  movieTitle: { fontSize: 16, fontWeight: 'bold', margin: 8, color: '#333' },
  movieInfo: { fontSize: 14, color: '#666', marginLeft: 8, marginBottom: 8 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' }
});
