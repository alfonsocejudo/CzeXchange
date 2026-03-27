import {useMemo} from 'react';
import {getNumberFormatSettings} from 'react-native-localize';

function addGroupSeparators(intStr: string, groupSep: string): string {
  return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
}

export function useCurrencyFormatter() {
  return useMemo(() => {
    const {decimalSeparator: decimalSep, groupingSeparator: groupSep} =
      getNumberFormatSettings();

    const formatAmount = (raw: string): string => {
      if (!raw) {
        return '';
      }
      const [intStr, fracStr] = raw.split('.');
      const n = parseInt(intStr, 10);
      if (isNaN(n)) {
        return raw;
      }
      const formatted = addGroupSeparators(String(n), groupSep);
      if (fracStr !== undefined) {
        return formatted + decimalSep + fracStr;
      }
      if (raw.endsWith('.')) {
        return formatted + decimalSep;
      }
      return formatted;
    };

    const formatResult = (value: number): string => {
      const fixed = value.toFixed(2);
      const [intStr, fracStr] = fixed.split('.');
      return addGroupSeparators(intStr, groupSep) + decimalSep + fracStr;
    };

    const stripGrouping = (text: string): string => {
      const stripped = text.split(groupSep).join('');
      return decimalSep !== '.' ? stripped.replace(decimalSep, '.') : stripped;
    };

    return {formatAmount, formatResult, stripGrouping};
  }, []);
}
