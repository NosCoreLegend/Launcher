declare namespace NewsPanelLessModule {
  export interface INewsPanelLess {
    newsPanel: string;
    statusPanel: string;
  }
}

declare const NewsPanelLessModule: NewsPanelLessModule.INewsPanelLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NewsPanelLessModule.INewsPanelLess;
};

export = NewsPanelLessModule;
