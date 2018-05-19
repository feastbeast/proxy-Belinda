module.exports = (styles) => `
  ${styles.map((style) => `
    <style>${style}</style>
  `)}
  <link rel="stylesheet" href="/css/nearby.css"></link>
`;