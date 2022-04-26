import createContextStore, { useContextStoreState } from "libs/createContextStore";
import { PullRequestsEffects } from "./effects";

export const PullRequestStore = createContextStore(
  () => {
    const { state, dispatch } = useContextStoreState({
      data: [] as any[],
      loading: false,
      error: null as any,
    });
    
    const fetch = async () => {
      dispatch({ loading: true })
      try {
        dispatch({
          data: await PullRequestsEffects.getPrs({
            repos: ['iahorro/laravel-iahorro-2018', 'samelan/iahorro-expertfront-ui'],
            state: 'OPEN',
            pagelen: '50',
            fields: 'values.id,values.updated_on,values.source.repository.full_name,values.links',
            sortBy: 'updated_on'
          }),
          loading: false,
          error: null
        });
      } catch (error) {
        dispatch({ error, loading: false, data: [] });
      }
    }
    
    return { state, actions: { fetch } }
  }
);