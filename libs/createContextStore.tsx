import { createContext, ReactNode, useContext, useMemo, useState } from "react";

/** Creates a simple store with React Context */
export default function createContextStore<
  S,
  A,
  V extends { state: S, actions: A }
>(
  useStoreHook: () => V
) {
  type Value = ReturnType<typeof useStoreHook>;
  const Context = createContext({ state: {}, actions: {} } as Value);

  const Provider = (props: { children: ReactNode }) => {
    const { actions, state } = useStoreHook();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = useMemo(() => ({ actions, state }), [state]);
  
    return <Context.Provider value={value as Value}>{props.children}</Context.Provider>;
  }

  return {
    Provider,
    useContext: () => useContext(Context),
  }
}

/** Extends setState API to expose a simple untyped reducer capabilities */
export function useContextStoreState<S extends {[key: string]: any}>(initialState: S) {
  const [state, setState] = useState(initialState);

  const dispatch = (payload: Partial<S>) => {
    setState({ ...state, ...payload })
  }

  return { state, dispatch, setState };
}