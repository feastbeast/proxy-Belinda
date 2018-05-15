module.exports = (styles) => `
  ${styles.map((style) => `
    <style>${style}</style>
  `)}
`;