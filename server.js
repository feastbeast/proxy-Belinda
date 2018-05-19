// require('newrelic');

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const clientBundles = __dirname + '/public/services';
const serverBundles = __dirname + '/templates/services';
const cssBundles = __dirname + '/public/css';
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, cssBundles, serviceConfig);

const React = require('react');
const ReactDOM = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');
const Styles = require('./templates/styles');
 
const renderComponents = (components, props = {}) => {
  return Object.keys(components).filter(item => {
    return !item.includes('css');
  }).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDOM.renderToString(component);
  });
};

const getCSS = (components) => {
  return Object.keys(components).filter(item => {
    return item.includes('css');
  }).map(item => {
    // console.log('css item: ', item);
    // console.log('css item value: ', components[item]);
    return components[item];
  });
};

app.get('/restaurants/:id', (req, res) => {
  // let compon
  let components = renderComponents(services, {restaurantId: req.params.id});
  let css = getCSS(services);
  // console.log('getCSS results: ', css);
  res.end(Layout(
    'Apateez',
    App(...components),
    Scripts(['nearby']),
    Styles(css)
  ));
  // res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use(express.static(path.join(__dirname, './public')));

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});