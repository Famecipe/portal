import packageJson from '../../package.json';

export const environment = {
  name: packageJson.name.slice(0, packageJson.name.indexOf('-')),
  version: packageJson.version,
  production: true
};
