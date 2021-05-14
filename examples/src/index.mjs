// Load the NoFlo module
import noflo from 'noflo';

// Use NoFlo's asCallback helper to prepare a JS function that wraps the graph
// "noflotest" is from package name, directory "graph" needs to be on same level as packages.json
const wrappedGraph = noflo.asCallback('noflotest/ShowContents', {
  // Provide the project base directory where NoFlo seeks graphs and components
  baseDir: './',
});

// Call the wrapped graph. Can be done multiple times
wrappedGraph({
  // Provide data to be sent to inports
  in: 'foo',
}, (err, result) => {
  // If component sent to its error port, then we'll have err
  if (err) { throw err; }
  // Do something with the results
  //console.log(result.out);
});