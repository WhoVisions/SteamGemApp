/* cross platform work tree creator and project generator */
const fs = require('fs');
const path = require('path');

function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true}); }
function writeOnce(f,c){ if(fs.existsSync(f)) return; ensureDir(path.dirname(f)); fs.writeFileSync(f,c); }

function initTree(){
  ['src','src/projects','src/shared','src/ui','src/ui/app','tools','tools/setup','tools/checks','docs','tests','.github/workflows'].forEach(ensureDir);
  [['src/README.md','Root source folder.'],
   ['src/projects/README.md','Projects go here. Use generator scripts.'],
   ['src/shared/README.md','Shared libs and services.'],
   ['src/ui/README.md','UI and web apps.'],
   ['docs/README.md','Documentation hub.']].forEach(([f,c])=>writeOnce(f,c+'\n'));
  console.log('Init complete');
}

function createNodeProject(name){
  const base = path.join('src','projects',name);
  ensureDir(base); ensureDir(path.join(base,'src'));
  const pkg = { name, private:true, version:'0.0.1', type:'module', engines:{node:">=22.0.0"},
    scripts:{ dev:"node src/index.js", start:"node src/index.js", test:"node -e \"console.log('test ok')\"" } };
  writeOnce(path.join(base,'package.json'), JSON.stringify(pkg,null,2)+'\n');
  writeOnce(path.join(base,'README.md'), '# '+name+'\nNode starter created by scaffold.\n');
  writeOnce(path.join(base,'src','index.js'), "console.log('hello from "+name+"')\n");
  console.log('Node project created at '+base);
}

function createPythonProject(name){
  const base = path.join('src','projects',name);
  ensureDir(base); ensureDir(path.join(base,'app'));
  writeOnce(path.join(base,'README.md'), '# '+name+'\nPython starter created by scaffold.\n');
  writeOnce(path.join(base,'requirements.txt'),'# add packages here\n');
  writeOnce(path.join(base,'pyproject.toml'),
"[project]\nname = \""+name+"\"\nversion = \"0.0.1\"\nrequires-python = \">=3\"\n");
  writeOnce(path.join(base,'app','__init__.py'),'');
  writeOnce(path.join(base,'main.py'),"def run():\n    print('hello from "+name+"')\nif __name__ == '__main__':\n    run()\n");
  console.log('Python project created at '+base);
}

function createNext16App(name='hello_next'){
  const base = path.join('src','projects',name);
  ensureDir(base);
  ensureDir(path.join(base,'app'));

  const pkg = {
    name, private:true, version:'0.0.1', type:'module',
    engines:{ node: ">=22.0.0" },
    scripts:{
      dev:"next dev -p 4444",
      build:"next build",
      start:"next start -p 4444",
      lint:"next lint",
      "build:ghpages":"NEXT_PUBLIC_BASE_PATH=/${npm_package_name} USE_GH_PAGES=true next build && next export -o ../../_site"
    },
    dependencies:{
      "next":"^16.0.0",
      "react":"^19.2.0",
      "react-dom":"^19.2.0"
    },
    devDependencies:{
      "typescript":"^5.5.0",
      "@types/node":"^22.0.0",
      "@types/react":"^19.0.0",
      "@types/react-dom":"^19.0.0",
      "babel-plugin-react-compiler":"^0.0.0",
      "eslint":"^9.0.0",
      "eslint-plugin-react-hooks":"^5.0.0",
      "eslint-config-next":"^16.0.0"
    }
  };
  fs.writeFileSync(path.join(base,'package.json'), JSON.stringify(pkg,null,2)+'\n');

  writeOnce(path.join(base,'next.config.ts'),
`const isGh = process.env.USE_GH_PAGES === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const assetPrefix = basePath ? \`${basePath}/\` : undefined;

const nextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  experimental: { turbopackFileSystemCacheForDev: true },
  images: { unoptimized: isGh },
  trailingSlash: isGh,
  basePath,
  assetPrefix
};
export default nextConfig;
`);

  writeOnce(path.join(base,'.babelrc'),
`{ "plugins": ["babel-plugin-react-compiler"] }
`);

  writeOnce(path.join(base,'app','layout.tsx'),
`export const metadata = { title: '${name}', description: 'Next 16 app' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}`);

  writeOnce(path.join(base,'app','page.tsx'),
`export default function Page() { return <main>Hello Next 16 on port 4444</main>; }`);

  writeOnce(path.join(base,'proxy.ts'),
`import { NextRequest, NextResponse } from 'next/server';
export default function proxy(request: NextRequest) {
  const url = new URL(request.url);
  if (url.pathname === '/') return NextResponse.redirect(new URL('/home', request.url));
  return NextResponse.next();
}
`);

  writeOnce(path.join(base,'tsconfig.json'),
`{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "preserve",
    "moduleResolution": "Bundler",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true
  },
  "include": ["**/*.ts","**/*.tsx"]
}`);

  writeOnce(path.join(base,'eslint.config.js'),
`import reactHooks from 'eslint-plugin-react-hooks';
export default [
  { plugins: { 'react-hooks': reactHooks }, rules: { ...reactHooks.configs.recommended.rules } }
];
`);

  console.log('Next 16 app created at '+base+' with port 4444 and GH Pages export');
}

function main(){
  const [, , cmd, kind, argName] = process.argv;
  if(cmd==='init'){ initTree(); return; }
  if(cmd==='new'){
    const name = argName || (kind==='next' ? 'hello_next' : 'my_app');
    if(kind==='node') return createNodeProject(name);
    if(kind==='python') return createPythonProject(name);
    if(kind==='next') return createNext16App(name);
    console.error('Usage: node tools/setup/scaffold.js new node|python|next <name>');
    process.exit(1);
  }
  console.log('Usage: init or new node|python|next <name>');
}
main();
