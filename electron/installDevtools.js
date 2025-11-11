export default async function installDevtools() {
  try {
    const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

    await installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('Failed to install React DevTools (non-critical): ', err.message));

    await installExtension(REDUX_DEVTOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('Failed to install Redux DevTools (non-critical): ', err.message));
  } catch (err) {
    console.log('DevTools installation skipped (non-critical):', err.message);
  }
}
