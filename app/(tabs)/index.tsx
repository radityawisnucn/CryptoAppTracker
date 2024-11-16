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
  const [limit] = useState<number>(10);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [usdToIdrRate, setUsdToIdrRate] = useState<number | null>(null);

  // Fungsi untuk memformat angka menjadi format IDR
  const formatIDR = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.currencyapi.com/v3/latest?apikey=cur_live_Bzt0fvNpkB1iWxGsL1Lf2NhRn0bYFwEPj7lm1nZk&currencies=IDR%2CUSD"
        );
        const data = await response.json();
        const rate = data.data.IDR.value;
        setUsdToIdrRate(rate);
      } catch (error) {
        console.error("Gagal mengambil nilai tukar USD ke IDR:", error);
        setError("Gagal mengambil nilai tukar. Silakan coba lagi nanti.");
      }
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    const getCryptosAndIcons = async () => {
      try {
        const response = await fetchCryptocurrencyList(
          (page - 1) * limit + 1,
          limit
        );
        setTotalCount(response.status.total_count);
        if (response.data.length === 0) {
          setHasMore(false);
          return;
        }

        const ids = response.data.map((crypto) => crypto.id);
        const details = await fetchCryptocurrencyDetails(ids);
        const iconMap: { [key: number]: string } = {};
        ids.forEach((id) => {
          if (details[id] && details[id].logo) {
            iconMap[id] = details[id].logo;
          } else {
            iconMap[id] = "https://via.placeholder.com/40";
          }
        });
        setIcons((prevIcons) => ({ ...prevIcons, ...iconMap }));
        setCryptos((prevCryptos) => [...prevCryptos, ...response.data]);

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
      const response = await fetchCryptocurrencyList(1, limit);
      setTotalCount(response.status.total_count);
      if (response.data.length === 0) {
        setHasMore(false);
        return;
      }

      const ids = response.data.map((crypto) => crypto.id);
      const details = await fetchCryptocurrencyDetails(ids);
      const iconMap: { [key: number]: string } = {};
      ids.forEach((id) => {
        if (details[id] && details[id].logo) {
          iconMap[id] = details[id].logo;
        } else {
          iconMap[id] = "https://via.placeholder.com/40";
        }
      });
      setIcons(iconMap);
      setCryptos(response.data);

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
      const priceUSD = item.quote?.USD?.price;
      const percentChange = item.quote?.USD?.percent_change_24h;
      const isPositive = percentChange >= 0;

      const priceIDR =
        priceUSD !== undefined && usdToIdrRate !== null
          ? formatIDR(priceUSD * usdToIdrRate)
          : "N/A";

      const logoUrl = icons[item.id] || "https://via.placeholder.com/40";

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
            <View>
              <Text style={styles.price}>
                {priceUSD !== undefined ? `$ ${priceUSD.toFixed(2)}` : "N/A"}
              </Text>
              <Text style={styles.priceIDR}>
                {priceIDR !== "N/A" ? `${priceIDR}` : "N/A"}
              </Text>
            </View>
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
    [icons, usdToIdrRate]
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
  priceIDR: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2cff05",
  },
  change: {
    fontSize: 18,
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
