module.exports = {
  lib: ['./src/components'], // need babel files or dirs
  dontLib: [], // dont babel files or dirs
  copy: [], // only copy files or dirs
  delete: ['favicon.ico', 'manifest.json'], // after copy builded, delete files
  sourceMap: true, // Is create sourceMap
};
