declare namespace LoginComponentLessModule {
  export interface ILoginComponentLess {
    login: string;
    loginButton: string;
    loginLogo: string;
    loginMenu: string;
    logoutMenu: string;
    online: string;
    userId: string;
  }
}

declare const LoginComponentLessModule: LoginComponentLessModule.ILoginComponentLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoginComponentLessModule.ILoginComponentLess;
};

export = LoginComponentLessModule;
