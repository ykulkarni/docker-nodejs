const plugin_versions = require('./plugin-versions.json').plugins;
const source_plugins_arr = require('./source_plugins.json');
const sort_plugins = require('./quicksort');
const excluded_plugins = require('./excluded_plugins.json');
const select_plugins = require('./select_plugins.json');
const fs = require('fs');

const plugins_report = {};

let dependency_size = {};

// Build source plugins object
const source_plugins = {};
for(source_plugin of source_plugins_arr){
  let source_plugin_att = source_plugin.split(':');
  source_plugins[source_plugin_att[0]] = source_plugin_att[1];
}
buildPluginTree();
// Collect plugins with no depedencies

for (const plugin of Object.keys(source_plugins)) {
  const versions = [];
  var dep = [];
  for(const version in plugin_versions[plugin]){
    dep = plugin_versions[plugin][version]["dependencies"];
    dependency_size[plugin] = dep.length;
    if(Array.isArray(dep) && dep.length === 0){
      versions.push(version);
    }   
  }
  if(dep.length === 0){
    plugins_report[plugin] = getLatestVersion(versions)
  }
}
let plugins_report_nd = {...plugins_report};

const sorted_plugin_size_array = sort_plugins.sortPluginByDependentSize(dependency_size);
// Collect rest of the plugins
//keep original versions of plugins
for (source_plugin of Object.keys(source_plugins)) {
  if(!plugins_report_nd[source_plugin]){
      plugins_report_nd[source_plugin] = source_plugins[source_plugin]      
    }
}
generate_tf_file('plugins_nd.tf', plugins_report_nd)
fs.writeFileSync('./plugin_report_nd.json', JSON.stringify(plugins_report_nd, null, 2));
let plugins_report_select = {...plugins_report_nd};
// let latestVersionOfPluginWithMaxDep = getLatestVersion(getPluginVersions(sorted_plugin_size_array[0].name));
// const dependents_with_max = plugin_versions[sorted_plugin_size_array[0].name][latestVersionOfPluginWithMaxDep]["dependencies"];
// plugins_report[sorted_plugin_size_array[0].name] = latestVersionOfPluginWithMaxDep;
// for(dependent of dependents_with_max){
//   if(dependent['optional'] === false){
//     processDependecyTree(dependent['name'], plugins_report);
//   }
// }


// let plugins_report_max = {...plugins_report};
// //keep original versions of plugins
// for (source_plugin of Object.keys(source_plugins)) {
//   if(!plugins_report_max[source_plugin]){
//     plugins_report_max[source_plugin] = source_plugins[source_plugin]      
//     }
// }

// fs.writeFileSync('./plugin_report_with_maxDep.json', JSON.stringify(plugins_report_max, null, 2));

// generate_tf_file('plugins_maxDep_with_source_version_for_rest.tf', plugins_report_max)
// console.log("Done max dep");
// // Collect rest of the plugins
// for (let i = 1; i < sorted_plugin_size_array.length ; i++) {
//   if(!plugins_report[sorted_plugin_size_array[i].name] && !excluded_plugins.includes(sorted_plugin_size_array[i].name)){
//     let latestVersionOfPlugin = getLatestVersion(getPluginVersions(sorted_plugin_size_array[i].name));
//     const plugin_deps = plugin_versions[sorted_plugin_size_array[i].name][latestVersionOfPlugin]["dependencies"];
//     plugins_report[sorted_plugin_size_array[i].name] = latestVersionOfPlugin;
//     for(dependent of plugin_deps){
//       if(dependent['optional'] === false ){
//         processDependecyTree(dependent['name'], plugins_report);
//       }
//     }
//   }
// }

// fs.writeFileSync('./plugin_report_all.json', JSON.stringify(plugins_report, null, 2));
// generate_tf_file('plugins.tf', plugins_report);


// Generate Tf file for excluded plugins

for(select_plugin of select_plugins){
  console.log(select_plugin);
    processDependecyTree(select_plugin, plugins_report_select);
}
for (source_plugin of Object.keys(source_plugins)) {
  if(!plugins_report_select[source_plugin]){
      plugins_report_select[source_plugin] = source_plugins[source_plugin]      
    }
}

generate_tf_file('plugins_select.tf', plugins_report_select);

function getPluginVersions(plugin_name){
  const pl_versions = [];
  for(const version in plugin_versions[plugin_name]){
    pl_versions.push(version);
  }
  return pl_versions;
}

function getLatestVersion(pl_versions){
  var latest = pl_versions[0];
  if(pl_versions.length === 1){
    return latest
  }
  for(let i = 0; i < pl_versions.length; i++ ){
    j = i + 1
    if(isNewVersionScheme(pl_versions[j]) && isSemVersionScheme(pl_versions[i])){
      latest = pl_versions[j]
      break;
    }
    if(isNewVersionScheme(pl_versions[i]) && isSemVersionScheme(pl_versions[j])){
      latest = pl_versions[i]
      break;
    }
    else {
      const [majorI, minorI, patchI] = String(pl_versions[i]).split('.').map(parseInt);
      const [majorJ, minorJ, patchJ] = String(pl_versions[j]).split('.').map(parseInt);
      
      if (majorI !== majorJ) {
        latest = majorI > majorJ ? pl_versions[i] : pl_versions[j];
        break;
      }
      
      if (minorI !== minorJ) {
        latest = minorI > minorJ ? pl_versions[i] : pl_versions[j];
        break;
      }
      if (patchI && patchJ && patchI !== patchJ) {
        latest = patchI > patchJ ? pl_versions[i] : pl_versions[j];
        break;
      }
    }
  }
  return latest;

}

function isSemVersionScheme(version){
  return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(version)
}

function isNewVersionScheme(version){
  return /^\d*\.v/.test(version);
}

function processDependecyTree(plugin_name, plugin_obj){
  let latest_version = getLatestVersion(getPluginVersions(plugin_name));
  plugin_obj[plugin_name] = latest_version;
  console.log(`== ${plugin_name}`);
  deps = plugin_versions[plugin_name][latest_version]["dependencies"];
  if(deps.length === 0){
    return
  }else{
    for(dep of deps){
      if(dep['optional'] === false){
        processDependecyTree(dep['name'], plugin_obj);  
      }
    }    
  }
}

function generate_tf_file(filename, plugins_obj){
  let tf_array = []

  for(plugin_name of Object.keys(plugins_obj)){
    tf_array.push(`${plugin_name}:${plugins_obj[plugin_name]}`)
  }

  tf_array.sort();

  let tf_file_data = `locals {\n\t	# see ./README.md#Adding Plugins\n\t plugins = ${JSON.stringify(tf_array)} \n}`;
  fs.writeFileSync(`${filename}`,tf_file_data);

}

function buildPluginTree(){

  //Build tree of dependents
  const plugin_tree = {};
  for(source_plugin of Object.keys(source_plugins)){
    plugin_tree[source_plugin] = {};
    let version = getLatestVersion(getPluginVersions(source_plugin));
    plugin_tree[source_plugin]["version"] = version;
    // console.log(source_plugin);
    const deps = plugin_versions[source_plugin][version]["dependencies"];
    if(deps.length !== 0){
      plugin_tree[source_plugin]["dependents"] = []
      for(dep of deps){
        let versions = getPluginVersions(dep.name);
        let version_obj_arr = [];
        for(dep_version of versions){
          version_obj_arr.push({version :dep_version, buildDate: plugin_versions[dep.name][dep_version]["buildDate"]})
        }
        plugin_tree[source_plugin]["dependents"].push({name: dep.name, version: dep.version, compatible: version_obj_arr});

      }
    }
    
  }
  fs.writeFileSync('./plugin_tree.json', JSON.stringify(plugin_tree, null, 2));
}
