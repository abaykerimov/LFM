export const env = (key) => {

  let data = {
    apiUrl: 'http://kerimov.kz/api/',
  };

  return data[key] || null;
};
