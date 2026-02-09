import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import { styles } from '../styles/PermissionDialog';

class PermissionDialog extends PureComponent {
  _handleOpenSettings = () => {
    const { onOpenSettings } = this.props;
    if (onOpenSettings) {
      onOpenSettings();
    }
  };

  _handleCheckAgain = () => {
    const { onCheckAgain } = this.props;
    if (onCheckAgain) {
      onCheckAgain();
    }
  };

  _handleDismiss = () => {
    const { onDismiss } = this.props;
    if (onDismiss) {
      onDismiss();
    }
  };

  render() {
    const {
      classes: styles,
      open = false,
      title = 'Full Disk Access Required',
      message = 'OpenMTP needs Full Disk Access to read and write files on your computer.',
      showOpenSettingsButton = true,
    } = this.props;

    return (
      <Dialog
        open={open}
        aria-labelledby="permission-dialog-title"
        disableEscapeKeyDown={false}
        onClose={this._handleDismiss}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="permission-dialog-title">
          <div className={styles.title}>
            <WarningIcon color="error" />
            <span>{title}</span>
          </div>
        </DialogTitle>
        <DialogContent className={styles.contentWrapper}>
          <DialogContentText className={styles.messageText}>
            {message}
          </DialogContentText>
          <Typography variant="body2" color="textSecondary">
            To grant permission:
          </Typography>
          <ol className={styles.instructionsList}>
            <li>Click &quot;Open System Preferences&quot; below</li>
            <li>Click the lock icon and enter your password</li>
            <li>Find and check the box next to &quot;OpenMTP&quot; or &quot;Terminal&quot;</li>
            <li>Click &quot;Check Again&quot; to verify</li>
          </ol>
        </DialogContent>
        <DialogActions>
          {showOpenSettingsButton && (
            <Button
              onClick={this._handleOpenSettings}
              color="primary"
              variant="contained"
              className={classNames(styles.btnOpenSettings)}
            >
              Open System Preferences
            </Button>
          )}
          <Button
            onClick={this._handleDismiss}
            color="secondary"
            className={classNames(styles.btnNegative)}
          >
            Dismiss
          </Button>
          <Button
            onClick={this._handleCheckAgain}
            color="primary"
            className={classNames(styles.btnPositive)}
          >
            Check Again
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(PermissionDialog);
