function getIconFromUrl(url){
  type = resolveType(url);
  if(type!='other'){
    return './icons/'+typeImageMap[type];
  }
  return './icons/logo-138.png';
}


var typeMap = {};
typeMap['docs.google.com/document'] = 'document'
typeMap['docs.google.com/spreadsheets'] = 'spreadsheets'
typeMap['trello.com'] = 'trello';
typeMap['flickr.com'] = 'flickr';
typeMap['youtube.com'] = 'youtube';
typeMap['box.com'] = 'box';
typeMap['facebook.com'] = 'facebook';
typeMap['github.com'] = 'git';
typeMap['piazza.com'] = 'piazza';
typeMap['drive.google.com'] = 'drive';
typeMap['instagram.com'] = 'instagram';
typeMap['docs.google.com/presentation'] = 'presentation';
typeMap['docs.google.com/forms'] = 'forms';

var typeImageMap = {};
typeImageMap['document'] = 'docs-icon.png';
typeImageMap['spreadsheets'] = 'sheets-icon.png';
typeImageMap['facebook'] = 'facebook-icon.png';
typeImageMap['trello'] = 'trello-logo.png';
typeImageMap['youtube'] = 'youtube-icon.png';
typeImageMap['box'] = 'box-icon.png';
typeImageMap['piazza'] = 'piazza-icon.png';
typeImageMap['flickr'] = 'flickr-logo.png';
typeImageMap['git'] = 'git-icon.png'
typeImageMap['other'] = 'pbl-logo.png';
typeImageMap['drive'] = 'drive-icon.png';
typeImageMap['instagram'] = 'instagram-logo.png';
typeImageMap['presentation'] = 'sheets-icon.png';
typeImageMap['form'] = 'forms-icon.png';

function resolveType(url){
  var keys = _.keys(typeMap);
  var match = 'other';
  for(var i=0;i<keys.length;i++){
    if(url.indexOf(keys[i]) >= 0){
      match = typeMap[keys[i]];
      return match;
    }
  }
  return match;
}
