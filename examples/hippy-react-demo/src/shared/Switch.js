import React, { useState } from 'react';
import { View, StyleSheet } from '@hippy/react';

const IOS_SWITCH_WIDTH = 51;
const IOS_SWITCH_HEIGHT = 31;
const IOS_SWITCH_PADDING = 2;

const Switch = (props) => {
  const { value, onValueChange, disabled } = props;
  const [internalValue, setInternalValue] = useState(value || false);

  const handlePress = () => {
    if (disabled) {
      return;
    }
    const newValue = !internalValue;
    setInternalValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const switchStyles = [
    styles.switch,
    {
      backgroundColor: internalValue ? '#4CD964' : '#E5E5EA',
      borderColor: internalValue ? '#4CD964' : '#E5E5EA',
    },
    disabled && styles.switchDisabled,
  ];

  const switchThumbStyles = [
    styles.switchThumb,
    {
      left: internalValue ? IOS_SWITCH_WIDTH - IOS_SWITCH_HEIGHT + IOS_SWITCH_PADDING : IOS_SWITCH_PADDING,
    },
    disabled && styles.switchThumbDisabled,
  ];

  return (
    <View onClick={handlePress} style={switchStyles}>
      <View style={switchThumbStyles} />
    </View>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: IOS_SWITCH_WIDTH,
    height: IOS_SWITCH_HEIGHT,
    borderRadius: IOS_SWITCH_HEIGHT / 2,
    borderWidth: 1,
    justifyContent: 'center',
  },
  switchDisabled: {
    opacity: 0.5,
  },
  switchThumb: {
    position: 'absolute',
    width: IOS_SWITCH_HEIGHT - 2 * IOS_SWITCH_PADDING,
    height: IOS_SWITCH_HEIGHT - 2 * IOS_SWITCH_PADDING,
    borderRadius: (IOS_SWITCH_HEIGHT - 2 * IOS_SWITCH_PADDING) / 2,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  switchThumbDisabled: {
    backgroundColor: '#BFBFBF',
  },
});

export default Switch;
