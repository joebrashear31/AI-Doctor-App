import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';

const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000' // Android emulator -> host machine
    : 'http://localhost:8000'; // iOS Simulator (or web). For real device: use your LAN IP.

async function postJSON(path: string, body: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export default function ChatIntroScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<null | {
    emergency?: boolean;
    advice?: { advice: { step: string; details: string }[]; when_to_seek_care: string[]; disclaimer: string };
    error?: string;
    notice?: string;
  }>(null);

  const send = async () => {
    const text = message.trim();
    if (!text || loading) return;

    setLoading(true);
    setOutput(null);

    try {
      // 1) TRIAGE FIRST
      const payload = { age: 30, sex: 'female', symptoms: text, meds: [], conditions: [] };
      const triage = await postJSON('/triage', payload);

      if (triage.risk === 'emergency') {
        setOutput({ emergency: true, notice: 'Possible emergency. Please call 911 (or local equivalent).' });
        return;
      }

      // 2) PATIENT ADVICE
      const advice = await postJSON('/advice', payload);
      setOutput({ advice });
    } catch (e: any) {
      setOutput({ error: e.message ?? 'Something went wrong.' });
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={{ fontSize: 16 }}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>AI Doctor App</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>In instances of a medical emergency, please dial 911.</Text>
        </View>
        <View style={[styles.card, { marginTop: 10 }]}>
          <Text style={styles.cardText}>Suggestions are subject to error; verify with your primary care doctor.</Text>
        </View>

        {/* RESULTS */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 10 }}>
          {loading && (
            <View style={[styles.card, { alignItems: 'center' }]}>
              <ActivityIndicator />
              <Text style={{ marginTop: 8, color: '#5B6472' }}>Thinking…</Text>
            </View>
          )}

          {!!output?.error && (
            <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#EF4444' }]}>
              <Text style={{ color: '#991B1B', fontWeight: '700', marginBottom: 6 }}>Error</Text>
              <Text style={{ color: '#5B6472' }}>{output.error}</Text>
            </View>
          )}

          {!!output?.emergency && (
            <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#EF4444' }]}>
              <Text style={{ color: '#991B1B', fontWeight: '700', marginBottom: 6 }}>Emergency</Text>
              <Text style={{ color: '#5B6472' }}>{output.notice}</Text>
            </View>
          )}

          {!!output?.advice && (
            <View style={styles.card}>
              <Text style={{ fontWeight: '800', color: '#0F131A', marginBottom: 8 }}>At-home steps</Text>
              {output.advice.advice?.map((a, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text style={{ color: '#0F131A', fontWeight: '700' }}>{a.step}</Text>
                  <Text style={{ color: '#5B6472' }}>{a.details}</Text>
                </View>
              ))}

              {!!output.advice.when_to_seek_care?.length && (
                <>
                  <Text style={{ fontWeight: '800', color: '#0F131A', marginTop: 8, marginBottom: 4 }}>When to seek care</Text>
                  {output.advice.when_to_seek_care.map((w, idx) => (
                    <Text key={idx} style={{ color: '#5B6472' }}>• {w}</Text>
                  ))}
                </>
              )}

              {!!output.advice.disclaimer && (
                <Text style={{ color: '#6B7280', marginTop: 10 }}>{output.advice.disclaimer}</Text>
              )}
            </View>
          )}
        </ScrollView>

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Send a message..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="#9AA5B1"
            editable={!loading}
          />
          <TouchableOpacity style={[styles.sendBtn, loading && { opacity: 0.6 }]} onPress={send} disabled={loading}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{loading ? '...' : 'Send'}</Text>
          </TouchableOpacity>
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
  sendBtn: { backgroundColor: '#0F131A', paddingHorizontal: 16, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});
