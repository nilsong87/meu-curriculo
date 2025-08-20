// build.js - Script simples para o Vercel
const fs = require('fs');
const path = require('path');

// Criar pasta public se não existir
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Copiar arquivos para public
const filesToCopy = [
  'index.html',
  'settings'
];

filesToCopy.forEach(item => {
  const source = path.join(__dirname, item);
  const destination = path.join(__dirname, 'public', item);
  
  if (fs.existsSync(source)) {
    if (fs.statSync(source).isDirectory()) {
      copyFolderRecursiveSync(source, destination);
    } else {
      fs.copyFileSync(source, destination);
    }
  }
});

console.log('✅ Build concluído - Arquivos copiados para /public');

// Função para copiar pastas recursivamente
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  if (fs.statSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.statSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}