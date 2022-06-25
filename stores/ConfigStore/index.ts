// TODO: Provisional, make as store



export const REPOS_WATCHING = UNESTABLE_fromLocalStorage('CONFIG_REPOS_WATCHING', ['iahorro/laravel-iahorro-2018', 'samelan/iahorro-expertfront-ui'])
export const POLLING_INTERVAL_MINS = parseInt(UNESTABLE_fromLocalStorage('CONFIG_POLLING_INTERVAL_MINS', '1'))
export const USER = UNESTABLE_fromLocalStorage('CONFIG_USER', 'asaldana')?.toLowerCase();
export const TEAM = UNESTABLE_fromLocalStorage('CONFIG_TEAM', ['asaldana', 'iana rusu', 'Alejandro Manjón Gómez', 'Beatriz Vallejo', 'sergio.zarzuelo', 'José Luis Fernández Pérez'])
  ?.filter(member => member.toLowerCase() !== USER)
  ?.map(member => member.toLowerCase())

// Utilities

function UNESTABLE_fromLocalStorage(key: string, defaultData: any) {
  if (typeof window === 'undefined') return null;

  const get = () => {
    const dataRaw = window.localStorage.getItem(key);
    if (!dataRaw) throw new Error('No data for this key');
    const dataParsed = JSON.parse(dataRaw);
    return dataParsed;
  } 

  const save = () => {
    window.localStorage.setItem(key, JSON.stringify(defaultData || 'null'));
  }

  try {
    return get();
  } catch {
    save();
    return get();
  }
}