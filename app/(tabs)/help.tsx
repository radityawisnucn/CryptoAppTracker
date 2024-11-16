// app/tabs/help.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const Help = () => {
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Judul di luar Card */}
      <Text style={styles.title}>About Cryptocurrency{"\n"}and Blockchain</Text>

      {/* Card untuk Konten */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>What is Cryptocurrency</Text>
        <Text style={styles.content}>
          Cryptocurrency is a digital or virtual form of currency that uses
          cryptography for security. It operates independently of a central
          authority, making it decentralized and secure.
        </Text>

        <Text style={styles.subtitle}>How Does Blockchain Work?</Text>
        <Text style={styles.content}>
          Blockchain is a distributed ledger technology that records
          transactions across a network of computers. Each block contains a list
          of transactions, and once added to the chain, it is immutable and
          transparent.
        </Text>

        <Text style={styles.subtitle}>Cryptocurrency Advantages</Text>
        <Text style={styles.content}>
          <Text>
            <Text style={{ fontWeight: "700", color: "#fff" }}>
              - Decentralization :{" "}
            </Text>
            No central authority controls cryptocurrency. Cryptocurrency
            transactions are secure and encrypted. {"\n"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "700", color: "#fff" }}>
              - Security :{" "}
            </Text>
            Cryptocurrency uses cryptographic techniques to secure transactions.
            {"\n"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "700", color: "#fff" }}>
              - Transparency :{" "}
            </Text>
            Blockchain technology ensures transparency and immutability of data.
          </Text>
        </Text>

        <Text style={styles.subtitle}>Risks and Challenges</Text>
        <Text style={styles.content}>
          <Text>
            <Text style={{ fontWeight: "700", color: "#fff" }}>
              - Price Volatility :{" "}
            </Text>
            Cryptocurrency prices can be highly volatile. {"\n"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "700", color: "#fff" }}>
              - Regulations :{" "}
            </Text>
            Cryptocurrency regulations vary by country. {"\n"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "700", color: "#fff" }}>
              - Digital Security :{" "}
            </Text>
            Cryptocurrency wallets and exchanges can be vulnerable to hacking.
          </Text>
        </Text>

        <Text style={styles.subtitle}>Legal Position of Cryptocurrencies</Text>
        <Text style={styles.content}>
          Cryptocurrencies are not considered legal tender in most countries.
          However, they are legal to use and trade in many jurisdictions. Some
          countries have banned or restricted the use of cryptocurrencies due to
          concerns about money laundering and tax evasion.
        </Text>

        <Text style={styles.subtitle}>Regulatory Development</Text>
        <Text style={styles.content}>
          Governments and regulatory authorities are increasingly focusing on
          regulating cryptocurrencies and blockchain technology. They are
          working to establish guidelines and regulations to protect consumers
          and prevent illegal activities.
        </Text>

        <View style={styles.cretorContainer}>
          <Text style={styles.creator}>Raditya Wisnu C N @2024</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1, // Memastikan ScrollView mengisi seluruh layar
    backgroundColor: "#1a1a1a", // Warna latar belakang gelap
    paddingTop: 70,
  },
  contentContainer: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 24,
    color: "#ffffff",
    textAlign: "center",
  },
  card: {
    width: width * 0.95,
    backgroundColor: "#3a3a3a",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "flex-start",
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
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 12,
    color: "#ffffff",
  },
  content: {
    fontSize: 16,
    marginTop: 4,
    color: "#cccccc",
    textAlign: "justify",
    marginBottom: 12,
  },
  cretorContainer: {
    paddingTop: 20,
    width: "100%",
    alignItems: "center",
  },
  creator: {
    fontSize: 16,
    marginTop: 4,
    color: "#9f9f9f",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default Help;
