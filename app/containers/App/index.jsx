import { hot } from 'react-hot-loader/root';
import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { materialUiTheme, styles } from './styles';
import Alerts from '../Alerts';
import Titlebar from './components/Titlebar';
import ErrorBoundary from '../ErrorBoundary';
import Routes from '../../routing';
import { bootLoader } from '../../helpers/bootHelper';
import { settingsStorage } from '../../helpers/storageHelper';
import SettingsDialog from '../Settings';
import { withReducer } from '../../store/reducers/withReducer';
import reducers from './reducers';
import { copyJsonFileToSettings, freshInstall } from '../Settings/actions';
import {
  makeAppThemeMode,
  makeAppThemeModeSettings,
  makeMtpMode,
} from '../Settings/selectors';
import { getAppThemeMode } from '../../helpers/theme';
import { getMainWindowRendererProcess } from '../../helpers/windowHelper';
import { log } from '../../utils/log';
import { makeMtpDevice, makeMtpStoragesList } from '../HomePage/selectors';
import { analyticsService } from '../../services/analytics';
import { PermissionDialog } from '../../components/DialogBox';
import { IpcEvents } from '../../services/ipc-events/IpcEventType';

class App extends Component {
  constructor(props) {
    super(props);

    this.mainWindowRendererProcess = getMainWindowRendererProcess();

    this.allowWritingJsonToSettings = false;

    this.state = {
      permissionDialogOpen: false,
      permissionTitle: '',
      permissionMessage: '',
      permissionShowButton: true,
    };
  }

  componentWillMount() {
    try {
      this.setFreshInstall();

      if (this.allowWritingJsonToSettings) {
        this.writeJsonToSettings();
      }

      this.runAnalytics();
    } catch (e) {
      log.error(e, `App -> componentWillMount`);
    }
  }

  componentDidMount() {
    try {
      ipcRenderer.on('nativeThemeUpdated', this.nativeThemeUpdatedEvent);
      ipcRenderer.on(IpcEvents.PERMISSION_STATUS, this.handlePermissionStatus);

      bootLoader.cleanRotationFiles();
    } catch (e) {
      log.error(e, `App -> componentDidMount`);
    }
  }

  handlePermissionStatus = (event, { isAuthorized, title, message, showButton }) => {
    if (!isAuthorized) {
      this.setState({
        permissionDialogOpen: true,
        permissionTitle: title,
        permissionMessage: message,
        permissionShowButton: showButton,
      });
    } else {
      this.setState({
        permissionDialogOpen: false,
      });
    }
  };

  handlePermissionOpenSettings = () => {
    ipcRenderer.send(IpcEvents.OPEN_PERMISSION_SETTINGS);
  };

  handlePermissionCheckAgain = () => {
    ipcRenderer.send(IpcEvents.REQUEST_PERMISSION_CHECK);
  };

  handlePermissionDismiss = () => {
    this.setState({
      permissionDialogOpen: false,
    });
  };

  componentWillUnmount() {
    this.deregisterAccelerators();
    ipcRenderer.removeListener(
      'nativeThemeUpdated',
      this.nativeThemeUpdatedEvent
    );

    this.mainWindowRendererProcess.webContents.removeListener(
      'nativeThemeUpdated',
      () => {}
    );
    ipcRenderer.removeListener(IpcEvents.PERMISSION_STATUS, this.handlePermissionStatus);
  }

  nativeThemeUpdatedEvent = () => {
    // force update the component
    this.setState({});
  };

  getMuiTheme = () => {
    const { appThemeModeSettings } = this.props;
    const appThemeMode = getAppThemeMode(appThemeModeSettings);

    return createMuiTheme(materialUiTheme({ appThemeMode }));
  };

  setFreshInstall() {
    try {
      const { actionCreateFreshInstall } = this.props;
      const setting = settingsStorage.getItems(['freshInstall']);
      let isFreshInstall = 0;

      switch (setting.freshInstall) {
        case undefined:
        case null:
          // app was just installed
          isFreshInstall = 1;
          break;
        case 1:
          // second boot after installation
          isFreshInstall = 0;
          break;
        case -1:
          // isFreshInstall was reset
          isFreshInstall = 1;
          break;
        case 0:
        default:
          // more than 2 boot ups have occured
          isFreshInstall = 0;
          this.allowWritingJsonToSettings = true;

          return null;
      }

      actionCreateFreshInstall({ isFreshInstall });
    } catch (e) {
      log.error(e, `App -> setFreshInstall`);
    }
  }

  writeJsonToSettings() {
    try {
      const { actionCreateCopyJsonFileToSettings } = this.props;
      const settingsFromStorage = settingsStorage.getAll();

      actionCreateCopyJsonFileToSettings({ ...settingsFromStorage });
    } catch (e) {
      log.error(e, `App -> writeJsonToSettings`);
    }
  }

  async runAnalytics() {
    await analyticsService.init();
  }

  render() {
    const { classes: styles, mtpDevice, mtpStoragesList, mtpMode } = this.props;
    const { permissionDialogOpen, permissionTitle, permissionMessage, permissionShowButton } = this.state;
    const muiTheme = this.getMuiTheme();

    return (
      <div className={styles.root}>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Titlebar
            mtpDevice={mtpDevice}
            mtpStoragesList={mtpStoragesList}
            mtpMode={mtpMode}
          />
          <Alerts />
          <ErrorBoundary>
            <SettingsDialog />
            <PermissionDialog
              open={permissionDialogOpen}
              title={permissionTitle}
              message={permissionMessage}
              showOpenSettingsButton={permissionShowButton}
              onOpenSettings={this.handlePermissionOpenSettings}
              onCheckAgain={this.handlePermissionCheckAgain}
              onDismiss={this.handlePermissionDismiss}
            />
            <Routes />
          </ErrorBoundary>
        </MuiThemeProvider>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      actionCreateCopyJsonFileToSettings:
        ({ ...data }) =>
        (_, __) => {
          dispatch(copyJsonFileToSettings({ ...data }));
        },

      actionCreateFreshInstall:
        ({ ...data }) =>
        (_, getState) => {
          dispatch(freshInstall({ ...data }, getState));
        },
    },
    dispatch
  );

const mapStateToProps = (state) => {
  return {
    appThemeModeSettings: makeAppThemeModeSettings(state),
    appThemeMode: makeAppThemeMode(state),
    mtpDevice: makeMtpDevice(state),
    mtpMode: makeMtpMode(state),
    mtpStoragesList: makeMtpStoragesList(state),
  };
};

export default withReducer(
  'App',
  reducers
)(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(hot(App))));
