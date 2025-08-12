import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to the AI{"\n"}Doctor App</Text>
        <View style={{ height: 18 }} />
        <Link href="/register" asChild>
          <PrimaryButton title="New Patient" />
        </Link>
        <View style={{ height: 14 }} />
        <Link href="/chat-intro" asChild>
          <PrimaryButton title="Existing Patient" variant="secondary" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  card: { width: '92%', backgroundColor: '#fff', borderRadius: 18, paddingVertical: 36, paddingHorizontal: 20, alignItems: 'center' },
  title: { textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#0F131A' }
});
