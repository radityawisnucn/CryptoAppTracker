// app/tabs/dashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import {
  fetchCryptocurrencyList,
  fetchCryptocurrencyDetails,
  CryptoData,
} from "../../api/cryptocurrency";

const Dashboard = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [icons, setIcons] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10); // Jumlah crypto per halaman
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true); // Apakah masih ada data lebih banyak
  const [totalCount, setTotalCount] = useState<number>(0); // Total jumlah cryptocurrency

  useEffect(() => {
    const getCryptosAndIcons = async () => {
      try {
        // Mengambil daftar cryptocurrency dengan paginasi
        const response = await fetchCryptocurrencyList(
          (page - 1) * limit + 1,
          limit
        );
        console.log("Data Cryptocurrency:", response.data); // Untuk debugging

        // Set totalCount dari API
        setTotalCount(response.status.total_count);

        // Jika tidak ada data lagi, set hasMore ke false
        if (response.data.length === 0) {
          setHasMore(false);
          return;
        }

        // Mengambil ID dari cryptocurrency yang diambil
        const ids = response.data.map((crypto) => crypto.id);

        // Mengambil detail cryptocurrency, termasuk logo
        const details = await fetchCryptocurrencyDetails(ids);
        console.log("Data Cryptocurrency Details:", details); // Untuk debugging

        // Membuat pemetaan ID ke URL logo
        const iconMap: { [key: number]: string } = {};
        ids.forEach((id) => {
          if (details[id] && details[id].logo) {
            iconMap[id] = details[id].logo;
          } else {
            // Gunakan placeholder jika logo tidak tersedia
            iconMap[id] = "https://via.placeholder.com/40"; // URL placeholder yang valid
          }
        });

        // Menambahkan ikon ke state
        setIcons((prevIcons) => ({ ...prevIcons, ...iconMap }));

        // Menambahkan data baru ke state cryptos
        setCryptos((prevCryptos) => [...prevCryptos, ...response.data]);

        // Cek apakah sudah mencapai totalCount
        if (
          cryptos.length + response.data.length >=
          response.status.total_count
        ) {
          setHasMore(false);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data cryptocurrency. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    };

    getCryptosAndIcons();
  }, [page, limit]);

  const loadMoreCryptos = () => {
    if (isLoadingMore || loading || !hasMore) return;
    setIsLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
  };

  const onRefresh = async () => {
    setLoading(true);
    setError(null);
    setCryptos([]);
    setIcons({});
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
    try {
      // Mengambil ulang data
      const response = await fetchCryptocurrencyList(1, limit);
      console.log("Data Cryptocurrency:", response.data); // Untuk debugging

      // Set totalCount dari API
      setTotalCount(response.status.total_count);

      // Jika tidak ada data lagi, set hasMore ke false
      if (response.data.length === 0) {
        setHasMore(false);
        return;
      }

      // Mengambil ID dari cryptocurrency yang diambil
      const ids = response.data.map((crypto) => crypto.id);

      // Mengambil detail cryptocurrency, termasuk logo
      const details = await fetchCryptocurrencyDetails(ids);
      console.log("Data Cryptocurrency Details:", details); // Untuk debugging

      // Membuat pemetaan ID ke URL logo
      const iconMap: { [key: number]: string } = {};
      ids.forEach((id) => {
        if (details[id] && details[id].logo) {
          iconMap[id] = details[id].logo;
        } else {
          // Gunakan placeholder jika logo tidak tersedia
          iconMap[id] = "https://via.placeholder.com/40"; // URL placeholder yang valid
        }
      });

      // Menambahkan ikon ke state
      setIcons(iconMap);

      // Mengatur ulang data cryptocurrency
      setCryptos(response.data);

      // Cek apakah sudah mencapai totalCount
      if (response.data.length >= response.status.total_count) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data cryptocurrency. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: CryptoData }) => {
      const price = item.quote?.USD?.price;
      const percentChange = item.quote?.USD?.percent_change_24h;

      const isPositive = percentChange >= 0;

      // Mendapatkan URL logo dari pemetaan icons
      const logoUrl = icons[item.id] || "https://via.placeholder.com/40"; // Placeholder jika tidak ada

      return (
        <View style={styles.cryptoCard}>
          <View style={styles.cryptoHeader}>
            <Image
              source={{ uri: logoUrl }}
              style={styles.cryptoImage}
              resizeMode="contain"
            />
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <View style={styles.cryptoDetails}>
            <Text style={styles.price}>
              {price !== undefined ? `$${price.toFixed(2)}` : "N/A"}
            </Text>
            <Text
              style={[
                styles.change,
                { color: isPositive ? "#2cff05" : "#ff073a" },
              ]}
            >
              {percentChange !== undefined
                ? `${percentChange.toFixed(5)}%`
                : "N/A"}
            </Text>
          </View>
        </View>
      );
    },
    [icons]
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2cff05" />
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2cff05" />
        <Text style={styles.loadingText}>Memuat Cryptocurrency...</Text>
      </View>
    );
  }

  if (error && page === 1) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Cryptocurrency</Text>
      <FlatList
        data={cryptos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreCryptos}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={false}
        onRefresh={onRefresh}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.loaderContainer}>
              <Text style={styles.errorText}>
                Tidak ada data cryptocurrency.
              </Text>
            </View>
          ) : null
        }
      />
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 24,
    textAlign: "center",
  },
  list: {
    paddingBottom: 16,
  },
  cryptoCard: {
    backgroundColor: "#3a3a3a",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    // Shadow untuk iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow untuk Android
    elevation: 3,
    borderWidth: 1,
    borderColor: "#4a4a4a",
  },
  cryptoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cryptoImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#5a5a5a",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  cryptoDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2cff05",
  },
  change: {
    fontSize: 14,
    fontWeight: "500",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c2c2c",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#bbbbbb",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 12,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});

export default Dashboard;
