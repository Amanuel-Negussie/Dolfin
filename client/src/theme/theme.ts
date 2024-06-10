// src/theme.ts
import { createTheme } from '@mui/material/styles';
import { GridToolbar } from '@mui/x-data-grid';

// Extend the Theme to include MuiDataGrid
declare module '@mui/material/styles' {
  interface Components {
    MuiDataGrid?: {
      styleOverrides?: {
        root?: React.CSSProperties;
      };
      defaultProps?: {
        components?: {
          Toolbar?: typeof GridToolbar;
        };
      };
    };
  }
}

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid red',
        },
      },
      defaultProps: {
        components: {
          Toolbar: GridToolbar,
        },
      },
    },
  },
});

export default theme;
