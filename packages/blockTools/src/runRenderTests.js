/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import React from 'react';
// import renderer from 'react-test-renderer';
import { type } from '@lowdefy/helpers';
import { MemoryRouter } from 'react-router-dom';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });

import mockBlock from './mockBlock';

const runRenderTests = ({
  Block,
  examples,
  logger,
  meta,
  reset = () => null,
  validationsExamples,
}) => {
  const { before, methods, getProps } = mockBlock({ meta, logger });

  beforeEach(() => {
    reset();
    before();
  });

  examples.forEach((ex) => {
    const values = [type.enforceType(meta.valueType, null)];
    if (!type.isNone(ex.value)) {
      values.push(ex.value);
    }
    if (type.isArray(meta.values)) {
      values.push(...meta.values);
    }

    values.forEach((value, v) => {
      test(`Render ${ex.id} - value[${v}]`, async () => {
        // create shell to setup react hooks with getProps before render;
        const Shell = () => <Block {...getProps(ex)} value={value} methods={methods} />;
        const comp = await mount(
          <MemoryRouter>
            <Shell />
          </MemoryRouter>
        );
        await comp.instance().componentDidMount();
        await comp.update();
        expect(comp.html()).toMatchSnapshot();
        expect(comp.children().children().children().props()).toMatchSnapshot();
        // expect(comp.children().children().children().children().props()).toMatchSnapshot();
        // expect(
        //   comp.children().children().children().children().children().props()
        // ).toMatchSnapshot();
        // expect(
        //   comp.children().children().children().children().children().children().props()
        // ).toMatchSnapshot();
        // expect(
        //   comp.children().children().children().children().children().children().children().props()
        // ).toMatchSnapshot();
        comp.unmount();
      });

      if (meta.test && meta.test.validation) {
        (validationsExamples || []).map((validationEx) => {
          test(`Render validation.status = ${validationEx.status} ${ex.id} - value[${v}]`, async () => {
            // create shell to setup react hooks with getProps before render;
            const Shell = () => (
              <Block {...getProps(ex)} value={value} methods={methods} validation={validationEx} />
            );
            const comp = await mount(
              <MemoryRouter>
                <Shell />
              </MemoryRouter>
            );
            await comp.instance().componentDidMount();
            await comp.update();
            expect(comp.html()).toMatchSnapshot();
            comp.unmount();
          });
        });
      }

      if (meta.test && meta.test.required) {
        test(`Render required = true ${ex.id} - value[${v}]`, async () => {
          // create shell to setup react hooks with getProps before render;
          const Shell = () => <Block {...getProps(ex)} value={value} methods={methods} required />;
          const comp = await mount(
            <MemoryRouter>
              <Shell />
            </MemoryRouter>
          );
          await comp.instance().componentDidMount();
          await comp.update();
          expect(comp.html()).toMatchSnapshot();
          comp.unmount();
        });
      }
    });
  });
};

export default runRenderTests;
