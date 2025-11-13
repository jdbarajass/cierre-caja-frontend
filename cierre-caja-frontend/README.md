# React + Vite

npm run dev
npm install -D tailwindcss postcss autoprefixer


# 1. preparar env y build
echo "VITE_API_URL=https://cierre-caja-api.onrender.com" > .env.production
npm install
npm run build

# 2. (opcional) subir dist al repo en rama deploy-dist o main
git checkout -b deploy-dist
git add dist -f
git commit -m "Add production build for PythonAnywhere"
git push origin deploy-dist