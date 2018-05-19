module.exports = (items) => `
  <script src="/lib/react.production.min.js"></script>
  <script src="/lib/react-dom.production.min.js"></script>
  
  ${items.map(item => `
    <script src="/services/${item}.js"></script>
  `).join('\n')}
  
  <script>
  ${items.map(item => `
  ReactDOM.hydrate(
    React.createElement(Nearby, {restaurantId: window.location.href.split('/restaurants/')[1][0]}),
    document.getElementById('${item}')
  );`).join('\n')}
  </script>
  `;