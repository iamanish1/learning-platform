import { memo } from 'react';
import Card from './Card';

const MemoizedCard = memo(Card, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className &&
    prevProps.hover === nextProps.hover
  );
});

MemoizedCard.displayName = 'MemoizedCard';

export default MemoizedCard;

