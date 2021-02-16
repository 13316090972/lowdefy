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

import React, { useState } from 'react';
import { Typography } from 'antd';
import { blockDefaultProps } from '@lowdefy/block-tools';
import { type } from '@lowdefy/helpers';

import Icon from '../Icon/Icon';

const Title = Typography.Title;

const TitleInput = ({ blockId, events, properties, methods, value }) => {
  const [editing, setEdit] = useState(false);
  const editableEvents = {
    onStart: () => {
      setEdit(true);
      methods.triggerEvent({
        name: 'onStart',
      });
    },
    onChange: (val) => {
      setEdit(false);
      methods.setValue(val);
      methods.triggerEvent({ name: 'onChange', event: { value: val } });
    },
  };
  return (
    <Title
      id={blockId}
      className={methods.makeCssClass([
        properties.color && { color: `${properties.color} !important` },
        properties.style,
      ])}
      code={properties.code}
      copyable={
        type.isObject(properties.copyable)
          ? {
              text: properties.copyable.text,
              onCopy: () => {
                methods.triggerEvent({
                  name: 'onCopy',
                  event: { value: properties.copyable.text },
                });
              },
              icon:
                properties.copyable.icon &&
                (type.isArray(properties.copyable.icon) ? (
                  [
                    <Icon
                      key="copy-icon"
                      events={events}
                      blockId={`${blockId}_copyable_before_icon`}
                      properties={properties.copyable.icon[0]}
                    />,
                    <Icon
                      key="copied-icon"
                      events={events}
                      blockId={`${blockId}_copyable_after_icon`}
                      properties={properties.copyable.icon[1]}
                    />,
                  ]
                ) : (
                  <Icon
                    blockId={`${blockId}_copyable_icon`}
                    events={events}
                    properties={properties.copyable.icon}
                  />
                )),
              tooltips: properties.copyable.tooltips,
            }
          : properties.copyable
      }
      delete={properties.delete}
      disabled={properties.disabled}
      ellipsis={
        type.isObject(properties.ellipsis)
          ? {
              rows: properties.ellipsis.rows,
              expandable: properties.ellipsis.expandable,
              suffix: properties.ellipsis.suffix,
              onExpand: (ellipsis) => {
                methods.triggerEvent({
                  name: 'onExpand',
                  event: { ellipsis },
                });
              },
            }
          : properties.ellipsis
      }
      editable={
        type.isObject(properties.editable)
          ? {
              icon: properties.editable.icon && (
                <Icon
                  blockId={`${blockId}_editable_icon`}
                  events={events}
                  properties={properties.editable.icon}
                />
              ),
              tooltip: properties.editable.tooltip,
              editing: properties.editable.editing || editing,
              maxLength: properties.editable.maxLength,
              autoSize: properties.editable.autoSize,
              ...editableEvents,
            }
          : properties.editable !== false && editableEvents
      }
      level={properties.level}
      mark={properties.mark}
      type={properties.type}
      underline={properties.underline}
    >
      {value || ''}
    </Title>
  );
};
TitleInput.defaultProps = blockDefaultProps;

export default TitleInput;
