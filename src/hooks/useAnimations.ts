import { useRef, useEffect, useMemo, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

export function usePulseAnimation(active: boolean): Animated.Value {
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 0.5,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    pulseValue.setValue(1);
  }, [active, pulseValue]);

  return pulseValue;
}

export function useSpinAnimation(): {
  spin: Animated.AnimatedInterpolation<string>;
  triggerSpin: () => void;
} {
  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = useMemo(
    () =>
      spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg'],
      }),
    [spinValue],
  );

  const triggerSpin = useCallback(() => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [spinValue]);

  return { spin, triggerSpin };
}
