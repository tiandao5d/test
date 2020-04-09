module.exports = function(source, inputSourceMap) {
  let arr = [];
  source = source.replace(/imgs\/[^\.]+\.png/g, s => {
    let t = 'img' + (arr.length + 1);
    arr.push(`var ${t} = require('./${s}')`);
    return '${' + t + '}';
  });
  source = `${arr.join(';')};module.exports = \`${source}\``;
  console.log(source)
  this.callback(null, source, inputSourceMap);
};
