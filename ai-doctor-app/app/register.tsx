import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = name && dob && /.+@.+\..+/.test(email) && password.length >= 6;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={{ fontSize: 16 }}>‹</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.header}>Create your{`\n`}Account</Text>

        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} placeholderTextColor="#9AA5B1" />
        <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} keyboardType="numeric" placeholderTextColor="#9AA5B1" />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9AA5B1" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#9AA5B1" />

        <TouchableOpacity onPress={() => canSubmit && router.push('/chat-intro')} disabled={!canSubmit} style={[styles.submit, !canSubmit && { opacity: 0.5 }]}>
          <Text style={styles.submitText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.link} onPress={() => router.push('/chat-intro')}>Sign In</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingHorizontal: 18 },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#FFFFFFAA', marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18 },
  header: { fontSize: 24, fontWeight: '800', color: '#0F131A', marginBottom: 12 },
  input: { height: 46, borderRadius: 10, backgroundColor: '#F4F7FA', paddingHorizontal: 12, marginVertical: 6, fontSize: 16, color: '#0F131A' },
  submit: { height: 48, borderRadius: 12, backgroundColor: '#0F131A', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footerText: { textAlign: 'center', marginTop: 10, color: '#6B7280' },
  link: { color: '#0F131A', fontWeight: '700' }
});
