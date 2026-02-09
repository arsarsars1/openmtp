export class IpcEvents {
  static OPEN_FAQS_WINDOW = 'ipc.window.faqs';

  static OPEN_HELP_PHONE_NOT_CONNECTING_WINDOW =
    'ipc.window.helpPhoneNotConnecting';

  static OPEN_HELP_PRIVACY_POLICY_WINDOW = 'ipc.window.privacyPolicy';

  static OPEN_KEYBOARD_SHORTCUTS_WINDOW = 'ipc.window.keyboardShortcuts';

  static REPORT_BUGS_DISPOSE_MTP = 'ipc.reportBugsDisposeMtp';

  static REPORT_BUGS_DISPOSE_MTP_REPLY = 'ipc.reportBugsDisposeMtpReply';

  static REPORT_BUGS_DISPOSE_MTP_REPLY_FROM_MAIN =
    'ipc.reportBugsDisposeMtpReply.fromMain';

  static USB_HOTPLUG = 'ipc.usbHotplug';

  // Permission events
  static PERMISSION_STATUS = 'ipc.permission.status';

  static REQUEST_PERMISSION_CHECK = 'ipc.permission.requestCheck';

  static OPEN_PERMISSION_SETTINGS = 'ipc.permission.openSettings';

  static PERMISSION_CHECK_RESULT = 'ipc.permission.checkResult';
}
