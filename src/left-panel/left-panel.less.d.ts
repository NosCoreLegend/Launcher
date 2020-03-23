declare namespace LeftPanelLessModule {
  export interface ILeftPanelLess {
    leftNavBar: string;
    leftPanel: string;
    playButton: string;
    progressBar: string;
  }
}

declare const LeftPanelLessModule: LeftPanelLessModule.ILeftPanelLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LeftPanelLessModule.ILeftPanelLess;
};

export = LeftPanelLessModule;
