import { mixins } from '../../../styles/js';

export const styles = (theme) => ({
  root: {},
  contentWrapper: {
    minWidth: 400,
  },
  icon: {
    fontSize: 48,
    color: theme.palette.warning.main,
    marginBottom: theme.spacing(2),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  messageText: {
    marginBottom: theme.spacing(2),
  },
  instructionsList: {
    paddingLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    '& li': {
      marginBottom: theme.spacing(0.5),
    },
  },
  btnPositive: {
    ...mixins({ theme }).btnPositive,
  },
  btnNegative: {
    ...mixins({ theme }).btnNegative,
  },
  btnOpenSettings: {
    marginRight: 'auto',
  },
});
