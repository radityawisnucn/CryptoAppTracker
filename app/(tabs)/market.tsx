// app/(tabs)/market/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import {
  fetchCryptocurrencyList,
  fetchCryptocurrencyDetails,
  CryptoData,
} from "../../api/cryptocurrency";
import { useRouter } from "expo-router";
import debounce from "lodash.debounce";

interface ExtendedCryptoData extends CryptoData {
  logo?: string;
}

const LIMIT = 50; // Jumlah item per halaman

const Market = () => {
  const [cryptos, setCryptos] = useState<ExtendedCryptoData[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<ExtendedCryptoData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [start, setStart] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const router = useRouter();

  // Fungsi untuk mengambil data cryptocurrency
  const getCryptos = async (initial: boolean = false) => {
    if (initial) {
      setLoading(true);
      setStart(1);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await fetchCryptocurrencyList(initial ? 1 : start, LIMIT);

      // Cek apakah ada lebih banyak data
      if (data.data.length < LIMIT) {
        setHasMore(false);
      } else {
        setStart((prev) => prev + LIMIT);
      }

      // Ambil detail untuk logo
      const ids = data.data.map((crypto) => crypto.id);
      const details = await fetchCryptocurrencyDetails(ids);

      // Gabungkan logo ke data crypto
      const extendedData: ExtendedCryptoData[] = data.data.map((crypto) => ({
        ...crypto,
        logo: details[crypto.id]?.logo || "",
      }));

      if (initial) {
        setCryptos(extendedData);
        setFilteredCryptos(extendedData);
      } else {
        setCryptos((prev) => [...prev, ...extendedData]);
        setFilteredCryptos((prev) => [...prev, ...extendedData]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memuat data cryptocurrency.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getCryptos(true);
  }, []);

  // Fungsi untuk menangani pencarian dengan debounce
  // Menggunakan useCallback untuk menghindari pembuatan ulang fungsi setiap render
  const debouncedSearch = useCallback(
    debounce((text: string, cryptosData: ExtendedCryptoData[]) => {
      const filtered = cryptosData.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(text.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCryptos(filtered);
    }, 300),
    []
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text, cryptos);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !search) {
      getCryptos();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getCryptos(true);
  };

  const renderItem = ({ item }: { item: ExtendedCryptoData }) => (
    <TouchableOpacity
      style={styles.cryptoCard}
      onPress={() => {
        console.log("Navigating to detail with ID:", item.id); // Log ID sebelum navigasi
        router.push(`/market/${item.id}`); // Path relatif
      }}
    >
      <View style={styles.cryptoInfo}>
        {item.logo ? (
          <Image source={{ uri: item.logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>
            {item.name} ({item.symbol.toUpperCase()})
          </Text>
          <Text style={styles.price}>${item.quote.USD.price.toFixed(2)}</Text>
        </View>
      </View>
      <Text
        style={
          item.quote.USD.percent_change_24h >= 0
            ? styles.changeUp
            : styles.changeDown
        }
      >
        {item.quote.USD.percent_change_24h}%
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator style={{ margin: 16 }} size="small" color="#ffffff" />
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Tidak ada cryptocurrency yang ditemukan.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Cari Cryptocurrency..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={handleSearch}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {loading && !refreshing ? (
        <ActivityIndicator style={styles.loader} size="large" color="#ffffff" />
      ) : (
        <FlatList
          data={filteredCryptos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ffffff"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 80,
    backgroundColor: "#1e1e1e",
  },
  cryptoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#3a3a3a",
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cryptoInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  textContainer: {
    flexDirection: "column",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  price: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 4,
  },
  changeUp: {
    fontSize: 14,
    color: "#2cff05",
    fontWeight: "600",
  },
  changeDown: {
    fontSize: 14,
    color: "#ff073a",
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    padding: 16,
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: "#3a3a3a",
    color: "#ffffff",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});

export default Market;
