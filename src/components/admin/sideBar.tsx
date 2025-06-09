'use client';

import React, { FC } from 'react';

const Sidebar: FC = () => {
  return (
    <aside style={styles.sidebar}></aside>
  );
};

const styles: {
  sidebar: React.CSSProperties;
} = {
  sidebar: {
    width: '18px', // Reducido a la mitad del tamaño original (180px / 2)
    height: '10vh',
    backgroundColor: 'ffffff', // Color completamente negro
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
  },
};

export default Sidebar;