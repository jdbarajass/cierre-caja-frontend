# React + Vite

npm run dev
npm install -D tailwindcss postcss autoprefixer


# 1. preparar env y build
.env.production
"VITE_API_URL=https://cierre-caja-api.onrender.com"
npm install
npm run build
git add dist -f (Para añadir la carperta assets)
git commit -m "Add production build for PythonAnywhere"
git push origin "la rama en la que estes o si creaste una ponerla como en el paso 2."


# 2. (opcional) subir dist al repo en rama deploy-dist o main
git checkout -b deploy-dist
git add dist -f
git commit -m "Add production build for PythonAnywhere"
git push origin deploy-dist