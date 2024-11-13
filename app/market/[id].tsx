// app/(tabs)/market/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // Menggunakan useLocalSearchParams
import {
  fetchCryptocurrencyDetails,
  CryptoInfo,
} from "../../api/cryptocurrency";
import { FontAwesome6 } from "@expo/vector-icons";

interface CryptoDetail extends CryptoInfo {
  id: number;
  urls: {
    website: string[];
    technical_doc: string[];
    twitter: string[];
    reddit: string[];
    message_board: string[];
    announcement: string[];
    chat: string[];
    explorer: string[];
    source_code: string[];
    [key: string]: string[];
  };
}

const { width } = Dimensions.get("window");

const Detail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Mengambil parameter id dari URL
  const [crypto, setCrypto] = useState<CryptoDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Received ID:", id); // Log ID untuk verifikasi

    if (!id) {
      console.error("ID tidak ditemukan!");
      Alert.alert("Error", "ID cryptocurrency tidak ditemukan.");
      setLoading(false);
      return;
    }

    const getCryptoDetail = async () => {
      try {
        const data = await fetchCryptocurrencyDetails([Number(id)]);
        console.log("Fetched Data:", data); // Log data yang diambil

        // Asumsikan bahwa data yang dikembalikan adalah { [id]: { ... } }
        const cryptoData = data[Number(id)];
        console.log("Crypto Data for ID:", cryptoData); // Log data spesifik crypto

        if (cryptoData) {
          setCrypto({
            id: cryptoData.id,
            name: cryptoData.name || "Nama Tidak Tersedia",
            symbol: cryptoData.symbol || "Simbol Tidak Tersedia",
            slug: cryptoData.slug || "",
            description: cryptoData.description || "Deskripsi Tidak Tersedia",
            logo: cryptoData.logo || "",
            urls: cryptoData.urls,
            date_added: cryptoData.date_added,
            date_launched: cryptoData.date_launched,
            tags: cryptoData.tags || [],
            category: cryptoData.category || "Kategori Tidak Tersedia",
            // Tambahkan properti lain jika ada
          });
        } else {
          console.error("Data cryptocurrency tidak ditemukan untuk ID:", id);
          Alert.alert("Error", "Data cryptocurrency tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error fetching cryptocurrency details:", error);
        Alert.alert("Error", "Gagal memuat data cryptocurrency.");
      } finally {
        setLoading(false);
      }
    };
    getCryptoDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!crypto) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Data tidak tersedia.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(tabs)/market")}
        >
          <FontAwesome6 name="arrow-left" size={32} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.name}>{crypto.name} Details</Text>
      </View>
      <View style={styles.card}>
        {crypto.logo ? (
          <Image source={{ uri: crypto.logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoPlaceholderText}>Logo</Text>
          </View>
        )}
        <Text style={styles.name}>
          {crypto.name} ({crypto.symbol.toUpperCase()})
        </Text>
        <Text style={styles.description}>{crypto.description}</Text>

        {/* Informasi Tambahan */}
        <View style={styles.infoContainer}>
          <InfoRow label="Kategori" value={crypto.category} />
        </View>

        {/* Tombol Twitter */}
        {crypto.urls.twitter.length > 0 && (
          <TouchableOpacity
            style={styles.twitterButton}
            onPress={() => Linking.openURL(crypto.urls.twitter[0])}
          >
            <Text style={styles.twitterButtonText}>Twitter {crypto.name}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Komponen untuk Menampilkan Baris Informasi
interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 120,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 55 : 20, // Adjust based on platform
    left: 16,
    right: 16,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    left: 5,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#3a3a3a",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#3a3a3a",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: width * 0.93,
    backgroundColor: "#3a3a3a",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 60,
    backgroundColor: "#444444",
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholderText: {
    color: "#ffffff",
    fontSize: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 16,
    color: "#ffffff",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#cccccc",
    textAlign: "justify",
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#333333",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  infoValue: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  twitterButton: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
  },
  twitterButtonText: {
    color: "#ffffff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700",
  },
  errorText: {
    fontSize: 18,
    color: "#ff073a",
    textAlign: "center",
  },
});

export default Detail;
