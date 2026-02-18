// src/theme/index.js
export const palette = {
  primary: {
    main: '#133B6B',
    light: '#3A6EA5',
    dark: '#0D2A4D',
  },
  secondary: {
    main: '#00C2D1',
    light: '#35D0FF',
    dark: '#00A8A8',
  },
  background: {
    default: '#0B1F3A',
    paper: '#132E4F',
  },
  text: {
    primary: '#F4F6F8',
    secondary: '#A7B4C2',
  },
  accent: {
    electricBlue: '#0099FF',
    purple: '#6C5CE7',
  },
};


export const roleThemes = {
  superadmin: {
    primary: '#133B6B',
    secondary: '#00C2D1',
    sidebar: '#F4F6F8',
    active: '#3A6EA5',
    text: '#0D2A4D',
    icon: '#133B6B',
  },
  admin: {
    primary: '#2C3E50',
    secondary: '#3498DB',
    sidebar: '#ECF0F1',
    active: '#2980B9',
    text: '#2C3E50',
    icon: '#34495E',
  },
  comite: {
    primary: '#8E44AD',
    secondary: '#9B59B6',
    sidebar: '#F4ECF7',
    active: '#6C3483',
    text: '#4A235A',
    icon: '#8E44AD',
  },
  asociacion: {
    primary: '#16A085',
    secondary: '#1ABC9C',
    sidebar: '#E8F6F3',
    active: '#117A65',
    text: '#0B5345',
    icon: '#16A085',
  },
  user: {
    primary: '#2874A6',
    secondary: '#3498DB',
    sidebar: '#EAF2F8',
    active: '#1B4D72',
    text: '#1B4D72',
    icon: '#2874A6',
  },
};


export const layoutConstants = {
  drawerWidth: 280,
  collapsedDrawerWidth: 72,
  appBarHeight: 64,
};