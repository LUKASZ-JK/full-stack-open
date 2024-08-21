import { useState } from 'react';

export default function useToggle(initialValue = false): [boolean, () => void] {
  const [on, setOn] = useState(initialValue);

  function toggle() {
    setOn(prevOn => !prevOn);
  }

  return [on, toggle];
}
