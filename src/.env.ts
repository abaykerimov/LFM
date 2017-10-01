export const env = (key) => {

  let data = {
    apiUrl: 'https://kerimov.kz/api/',
  };

  return data[key] || null;
};
