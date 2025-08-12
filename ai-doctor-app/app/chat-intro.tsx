import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

export default function ChatIntroScreen() {
  const [message, setMessage] = useState('');
  const send = () => { if (!message.trim()) return; setMessage(''); };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}><Text style={{ fontSize: 16 }}>‹</Text></TouchableOpacity>
          <Text style={styles.title}>AI Doctor App</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.card}><Text style={styles.cardText}>In instances of a medical emergency, please dial 911.</Text></View>
        <View style={[styles.card, { marginTop: 10 }]}><Text style={styles.cardText}>Suggestions are subject to error; verify with your primary care doctor.</Text></View>

        <View style={{ flex: 1 }} />

        <View style={styles.inputBar}>
          <TextInput style={styles.input} placeholder="Send a message..." value={message} onChangeText={setMessage} placeholderTextColor="#9AA5B1" />
          <TouchableOpacity style={styles.sendBtn} onPress={send}><Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 6 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#FFFFFFAA' },
  title: { fontSize: 20, fontWeight: '800', color: '#0F131A' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginTop: 14 },
  cardText: { color: '#5B6472', textAlign: 'center' },
  inputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 8, marginBottom: 14 },
  input: { flex: 1, height: 40, paddingHorizontal: 10, color: '#0F131A' },
  sendBtn: { backgroundColor: '#0F131A', paddingHorizontal: 16, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }
});
