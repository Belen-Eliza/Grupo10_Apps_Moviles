import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  cellCount: number;
}

const TokenInput: React.FC<TokenInputProps> = ({ value, onChange, cellCount }) => {
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (value.length === 0 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [value]);

  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;
    onChange(newValue.join(''));

    if (text.length === 1 && index < cellCount - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0 && !value[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(cellCount)].map((_, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="number-pad"
          maxLength={1}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    width: 45,
    height: 55,
    borderWidth: 3,
    borderColor: '#0082bf',
    borderRadius: 5,
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 4,
    color: '#004993',
    backgroundColor: '#FFFFFF',
  },
});

export default TokenInput;

