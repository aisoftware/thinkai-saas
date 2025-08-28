import { useState } from "react";

const useArrayState = <T>(initialArray: T[]) => {
  const [state, setState] = useState(initialArray);

  const add = (item: T) => {
    setState((prev) => [...prev, item]);
  };

  const remove = (index: number) => {
    setState((prev) => {
      const newState = [...prev];
      newState.splice(index, 1);
      return newState;
    });
  };

  return [state, { add, remove }];
};

export default useArrayState;
