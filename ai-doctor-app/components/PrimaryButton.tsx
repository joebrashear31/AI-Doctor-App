import { Pressable, Text, StyleSheet, View } from 'react-native';

export default function PrimaryButton({
  title, onPress, variant = 'primary'
}: { title: string; onPress?: () => void; variant?: 'primary' | 'secondary' }) {
  const isSecondary = variant === 'secondary';
  return (
    <View style={[styles.shadowWrap, isSecondary && styles.secondaryShadow]}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.base, isSecondary ? styles.secondary : styles.primary, pressed && { opacity: 0.85 }]}>
        <Text style={[styles.text, isSecondary && styles.secondaryText]}>{title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: { borderRadius: 28, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  secondaryShadow: { shadowOpacity: 0.04 },
  base: { height: 48, borderRadius: 28, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, minWidth: 220 },
  primary: { backgroundColor: '#0F131A' },
  secondary: { backgroundColor: '#F1F5F9' },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryText: { color: '#0F131A' }
});
