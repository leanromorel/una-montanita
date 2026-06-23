import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'whatsapp' | 'outline';
};

export function PrimaryButton({ title, onPress, disabled, variant = 'primary' }: Props) {
  return (
    <Pressable
      style={[
        styles.base,
        variant === 'whatsapp' && styles.whatsapp,
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
      ]}
      onPress={disabled ? undefined : onPress}>
      <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.cypress,
    borderRadius: Radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  whatsapp: { backgroundColor: '#25d366' },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.cypress },
  disabled: { backgroundColor: '#bbb' },
  text: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  textOutline: { color: Colors.cypress },
});
