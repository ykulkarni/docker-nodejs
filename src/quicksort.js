
const plugin_size_array = []
function sortPluginByDependentSize(plugins_obj){
  for(plugin_name of Object.keys(plugins_obj)){
    plugin_obj = {};
    plugin_obj['name'] = plugin_name;
    plugin_obj['size'] = plugins_obj[plugin_name];
    plugin_size_array.push(plugin_obj);
  }

  return plugin_size_array.sort(compare);
}

function compare( a, b ) {
  if ( a.size < b.size ){
    return 1;
  }
  if ( a.size > b.size ){
    return -1;
  }
  return 0;
}

module.exports = { sortPluginByDependentSize }
