const min = [22,0,0];
const cur = process.versions.node.split('.').map(Number);
function gte(a,b){ for(let i=0;i<3;i++){ if(a[i]>b[i]) return true; if(a[i]<b[i]) return false; } return true; }
if(!gte(cur,min)){
  console.error('Node 22 or newer required. Current ' + process.versions.node);
  process.exit(1);
}
