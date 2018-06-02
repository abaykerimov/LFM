export const env = (key) => {

  let data = {
    apiUrl: 'https://abay.dev.kerimov.kz/api/',
    //apiUrl: 'https://kerimov.kz/api/',

    pusherKey: '88f385f7d513e8876a5e',
    pusherCluster: 'ap2',
  };

  return data[key] || null;
};
