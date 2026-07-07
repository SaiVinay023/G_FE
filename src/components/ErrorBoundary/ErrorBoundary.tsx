// eslint-disable-next-line max-len

import ErrorIcon from '@mui/icons-material/Error';
import { Typography, Box, SvgIcon } from '@mui/material';
import { Component, ErrorInfo, ReactNode } from 'react';

import { Loader } from 'src/components/Loader';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          width="100%"
          p={3}
        >
          <Box pb={1}>
            <Loader
              color="error"
              render={() => (
                <SvgIcon color="warning" fontSize="large">
                  <ErrorIcon />
                </SvgIcon>
              )}
            />
          </Box>

          <Typography gutterBottom variant="h3" color="error">
            Something went wrong.
          </Typography>

          <Typography variant="subtitle1" color="error">
            We know about the error, and are already actively working on its solution.
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}
