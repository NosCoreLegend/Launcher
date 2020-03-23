declare namespace AppLessModule {
  export interface IAppLess {
    App: string;
  }
}

declare const AppLessModule: AppLessModule.IAppLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppLessModule.IAppLess;
};

export = AppLessModule;
