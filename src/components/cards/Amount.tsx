export function Amount({
  value,
  currency,
  showFlag,
}: {
  value: number | string;
  currency?: string;
  showFlag?: 'both' | 'negative';
}) {
  const val = typeof value === 'string' ? parseFloat(String(value)) : value;

  const currencySymbol = currency === 'USD' ? '$' : currency === 'CNY' ? '¥' : '';

  return (
    <>
      {currency && <span>{currencySymbol}</span>}
      {showFlag === 'negative' && val < 0 && <span>-</span>}

      <span>
        {showFlag === 'both' && <span>{val < 0 ? '-' : '+'}</span>}
        {Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </>
  );
}
