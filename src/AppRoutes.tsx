import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/404';

type Module = {
  [modulePath: string]: { default: React.ComponentType<unknown> };
};

const ROUTES: Module = import.meta.glob('/src/pages/**/[a-z[]*.tsx', {
  eager: true,
});

const routes = Object.keys(ROUTES).map(route => {
  const path = route
    .replace(/\/src\/pages|index|\.tsx$/g, '')
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1');

  return { path, component: ROUTES[route].default };
});

const AppRoutes = (): React.ReactElement => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>로딩중...</div>}>
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path || '/'} element={<Component />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
