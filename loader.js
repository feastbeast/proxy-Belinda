const newrelic = require('newrelic');

const fs = require('fs');
const fetch = require('node-fetch');
const Promise = require('bluebird');
const exists = Promise.promisify(fs.stat);


const loadBundle = function(cache, item, filename) {
  // add a small delay to ensure pipe has closed
  setTimeout(() => {
    // console.log('loading:', filename);
    cache[item] = require(filename).default;    
    // console.log(JSON.stringify(cache[item])); 
  }, 0);
};

const readBundle = function(cache, item, filename) {
  // console.log('reading', item, filename);
  cache[item + '-css'] = fs.readFileSync(filename, {encoding: 'utf8'});
  // console.log(cache[item + '-css']);
}

const fetchBundles = (path, services, suffix = '', require = false, filetype = 'js') => {
  Object.keys(services).forEach(item => {
    const filename = `${path}/${item}${suffix}.${filetype}`;
    exists(filename) //if already exists in proxy public files
      .then(() => {
        require && filetype === 'js' ? loadBundle(services, item, filename) : null;
        require && filetype === 'css' ? readBundle(services, item, filename) : null;
      })
      .catch(err => { //if doesn't
      if (err.code === 'ENOENT') {
        const url = `${services[item]}${item}${suffix}.${filetype}`;
        console.log(`Fetching: ${url}`);
        // see: https://www.npmjs.com/package/node-fetch
        fetch(url)
        .then(res => {
          const dest = fs.createWriteStream(filename);
          // const dest = fs.createWriteStream('./example.js');
          res.body.pipe(dest);
          res.body.on('end', () => {
            console.log('REACHED HERE', filename);
            require && filetype === 'js' ? loadBundle(services, item, filename) : null;
            require && filetype === 'css' ? readBundle(services, item, filename) : null;
          });

          res.body.n
        });
        } else {
          console.log('WARNING: Unknown fs error');
        }
      });
  });
};

module.exports = (clientPath, serverPath, cssPath, services) => {
  fetchBundles(clientPath, services);
  fetchBundles(serverPath, services, '-server', true);
  fetchBundles(cssPath, services, '', true, 'css');
  return services;
};