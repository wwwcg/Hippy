import React from 'react';
import {
  MemoryRouter,
  Route,
} from 'react-router-dom';
import { View } from '@hippy/react';
import routes2 from '../routes2';
import Header from '../shared/Header';
import Gallery2 from './gallery2';

const ALL_ROUTES = [{
  path: '/Gallery',
  name: 'Hippy React',
  component: Gallery2,
  meta: {
    style: 1,
  },
}, ...routes2];

export const Entry2 = () => (
  <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <MemoryRouter initialEntries={['/Gallery']}>
      {
        ALL_ROUTES.map((item) => {
          const Comp = item.component;
          return (
            <Route key={item.path} exact path={`${item.path}`}>
              <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header route={item} />
                <Comp meta={item.meta || {}} />
              </View>
            </Route>
          );
        })
      }
    </MemoryRouter>
  </View>
);

export default Entry2;
