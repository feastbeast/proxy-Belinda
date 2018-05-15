module.exports = (items) => `
  <script src="/lib/react.development.js"></script>
  <script src="/lib/react-dom.development.js"></script>
  <script src="/lib/jquery.min.js"></script>
  <script src="/lib/materialize.min.js"></script>
  
  ${items.map(item => `
    <script src="/services/${item}.js"></script>
  `).join('\n')}
  
  <script>
  ${items.map(item => `
  ReactDOM.hydrate(
    React.createElement(Nearby, {restaurantId: window.location.href.split('/restaurants/')[1]}),
    document.getElementById('${item}')
  );`).join('\n')}
  </script>
  `;