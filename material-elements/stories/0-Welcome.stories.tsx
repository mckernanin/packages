import React from 'react';
import { Thing } from '../src';

export default {
  title: 'Welcome',
};

export const toStorybook = () => <Thing />;

toStorybook.story = {
  name: 'to Storybook',
};
